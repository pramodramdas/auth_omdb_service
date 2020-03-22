const {getAuthClient} = require('../client')
const {getDeadLine} = require('../../config/grpc_conf')
const {getTracer} = require("../../config/zipkin")

const validateTokenGRPC = (token) => {
    let tracer = getTracer()

    return new Promise(async (resolve, reject) => {
        tracer.scoped(() => {
            return tracer.local('validateTokenGRPC validate', async () => {
                    try {
                        getAuthClient().Validate({token}, {deadline:getDeadLine()},(error, res) => {
                            if(error) {
                                console.log(error)
                                return reject(error)
                            }
                            resolve(res)
                        })
                    } catch(err) {
                        console.log(err)
                        reject(err)
                    }
            })
        })
    })
}

module.exports = {
    validateTokenGRPC
}
