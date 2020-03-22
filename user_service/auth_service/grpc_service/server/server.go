package server

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"

	"github.com/pramod/auth_service/grpc_service/authpb"
	"github.com/pramod/auth_service/models"
	util "github.com/pramod/auth_service/utils"
	config "github.com/pramod/auth_service/config"
	"google.golang.org/grpc"
)

type server struct{}
type userObj struct {
	Name, Email, Role, Token string
}

type userAll models.UserMembers
type utilAll util.UtilMembers
type zepkinAll config.ZepkinMembers

var utilMem *utilAll
var userMem *userAll
var zepkinMem *zepkinAll

func init() {
	userMem = &userAll{UserInterface: models.User{}}
	utilMem = &utilAll{UtilInterface: util.Util{}}
	zepkinMem = &zepkinAll{ZepkinInterface: config.ZepConf{}}
}

func (*server) Validate(ctx context.Context, req *authpb.TokenValidateRequest) (*authpb.TokenValidateResponse, error) {
	fmt.Println("GRPC Validate function was invoked")

	validateSpan, ctx := zepkinMem.ZepkinInterface.CustomStartSpanFromContext(ctx, "grpc Validate")

	token := req.GetToken()

	//time.Sleep(6 * time.Second)

	validateTokenSpan, _ := zepkinMem.ZepkinInterface.CustomStartSpanFromContext(ctx, "IsValidToken")
	claims, err := utilMem.UtilInterface.IsValidToken(token, "JWT_SECRET")
	zepkinMem.ZepkinInterface.CustomSpanFinish(validateTokenSpan)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	ExtractUserSpan, _ := zepkinMem.ZepkinInterface.CustomStartSpanFromContext(ctx, "ExtractUserFromInterface")
	userObj, err := userMem.UserInterface.ExtractUserFromInterface(claims)
	zepkinMem.ZepkinInterface.CustomSpanFinish(ExtractUserSpan)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	res := &authpb.TokenValidateResponse{
		Success: true,
		Email:   userObj.Email,
	}

	zepkinMem.ZepkinInterface.CustomSpanFinish(validateSpan)

	return res, nil
}

func StartGrpcServer() error {
	fmt.Println("GRPC server about to start")
	lis, err := net.Listen("tcp", ":"+os.Getenv("GRPC_PORT"))
	if err != nil {
		log.Fatalf("Failed to listen %v", err)
	}

	s := grpc.NewServer()
	authpb.RegisterAuthServiceServer(s, &server{})

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
		return err
	}
	fmt.Println("ssa")
	return nil
}
