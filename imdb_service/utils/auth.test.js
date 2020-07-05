const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

const rewire = require('rewire')
const { mockReq, mockRes } = require('sinon-express-mock')

let jwt = require('jsonwebtoken');
const auth = rewire('./auth.js')
const validateToken = rewire('../grpc_service/services/validate_token')

describe('checkUser', () => {
    let request = {
        headers:{},
        query:{}
    }

    it('gateway failure', async () => {
        const req = mockReq(request)
        const res = mockRes()
        const next = sinon.fake();
        req.get = () => {}
        await auth.checkUser(req, res, next)

        expect(res.json).to.be.calledWith({msg:"unauthorized"})
    })

    it('gateway success', () => {
        const req = mockReq(request)
        const res = mockRes()

        const next = sinon.fake();
        req.get = (k) => {
            if(k === "email") return "abc@gmail.com"
            else if(k === "role") return "admin"
        }
        auth.checkUser(req, res, next)

        expect(next).to.be.called
    })

    it('JWT_VALIDATION self', () => {
        process.env.JWT_VALIDATION = "self"
        const req = mockReq(request)
        const res = mockRes()
        req.get = (k) => {}
        const next = sinon.fake();
        auth.checkUser(req, res, next)

        expect(res.json).to.be.calledWith({msg:"unauthorized"})
    })

    it('JWT_VALIDATION self', async () => {
        process.env.JWT_VALIDATION = "self"
        const req = mockReq(request)
        const res = mockRes()
        req.get = (k) => {return "token"}
        let verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
            callback(null, {Email:'abc@gmail.com'})
        });
        const next = sinon.fake();
        await auth.checkUser(req, res, next)

        expect(req.headers['email']).to.equal("abc@gmail.com")
        verifyStub.restore()
    })

    it('JWT_VALIDATION self', async () => {
        process.env.JWT_VALIDATION = "self"
        const req = mockReq(request)
        const res = mockRes()
        req.get = (k) => {return "token"}
        let verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
            callback(null, {})
        });
        const next = sinon.fake();
        await auth.checkUser(req, res, next)
        expect(res.json).to.be.calledWith({msg:"unauthorized"})
        verifyStub.restore()
    })

    it('JWT_VALIDATION grpc success', async () => {
        process.env.JWT_VALIDATION = "grpc"
        const req = mockReq(request)
        const res = mockRes()
        req.get = (k) => {return "token"}

        const unset = auth.__set__({
            'validateTokenGRPC':() => {return Promise.resolve({Email:"abc@gmail.com", Success:true})}
        })
       
        const next = sinon.fake();
        await auth.checkUser(req, res, next)
        expect(req.headers['email']).to.equal("abc@gmail.com")
        unset()
    })

    it('JWT_VALIDATION grpc failure', async () => {
        process.env.JWT_VALIDATION = "grpc"
        const req = mockReq(request)
        const res = mockRes()
        req.get = (k) => {return "token"}

        const unset = auth.__set__({
            'validateTokenGRPC':() => {return Promise.resolve({Success:false})}
        })

        const next = sinon.fake();
        await auth.checkUser(req, res, next)
        expect(res.json).to.be.calledWith({msg:"unauthorized"})
        unset()
    })
    
})