FROM golang:latest

RUN mkdir "/go/src/github.com"
RUN mkdir "/go/src/github.com/pramod"
RUN mkdir "/go/src/github.com/pramod/auth_service"

WORKDIR "/go/src/github.com/pramod/auth_service/"

COPY ./auth_service ./

RUN go get -u "github.com/golang/dep/cmd/dep"
RUN dep init
RUN dep ensure

EXPOSE 8089
CMD ["go", "run", "./main.go"]