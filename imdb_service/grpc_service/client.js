const grpc = require('grpc');
const serverAddress = process.env.GRPC_SERVER_ADDR

const getAuthClient = () => {
    const PROTO_PATH = __dirname + '/pb/auth.proto'
    const grpc_service = grpc.load(PROTO_PATH).grpc_service
    
    return new grpc_service.AuthService(serverAddress, grpc.credentials.createInsecure())
}


module.exports = {
    getAuthClient
}