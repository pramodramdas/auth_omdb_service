let jwt = require('jsonwebtoken');
let {validateTokenGRPC} = require('../grpc_service/services/validate_token')
const {getTracer} = require("../config/zipkin")

const checkUser = async (req, res, next) => {
    let tracer = getTracer()
    let token = req.get('token') || req.query.token

    if(process.env.JWT_VALIDATION === "self") {
        tracer.scoped(() => {
            return tracer.local('checkUser self validate', async () => {

                if(!token)
                    return res.status(401).json({msg:"unauthorized"})
                
                try {
                    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
                        if (err) {
                            console.log(err)
                            return res.status(401).json({msg:"unauthorized"})
                        }
                        if(decoded.Email)
                            req.headers['email'] = decoded.Email
                        else
                            return res.status(401).json({msg:"unauthorized"})
                    })
                } catch(err) {
                    console.log(err)
                    return res.status(401).json({msg:"unauthorized"})
                }

            })
        })
    }
    else if(process.env.JWT_VALIDATION  === "grpc") {
        tracer.scoped(() => {
            return tracer.local('checkUser grpc validate', async () => {

                try {
                    let {Success, Email} = await validateTokenGRPC(token)
                    if(!Success || !Email)
                        return res.status(401).json({msg:"unauthorized"})

                    req.headers['email'] = Email
                } catch(err) {
                    console.log(err)
                    return res.status(401).json({msg:"unauthorized"})
                }

            })
        })
    }
    else if(!req.get("email") || !req.get("role")) {
        tracer.scoped(() => {
            return tracer.local('checkUser gateway validate', async () => {
                return res.status(401).json({msg:"unauthorized"})
            })
        })
    }
    
    next()
}

module.exports = {
    checkUser
}