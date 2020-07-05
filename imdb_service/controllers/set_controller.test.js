const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

const rewire = require('rewire')
const { mockReq, mockRes } = require('sinon-express-mock')

const setController = rewire('./set_controller.js')
let jwt = rewire('jsonwebtoken');
//const zipkin = rewire("../config/zipkin")

const axios = require('axios')


describe('setFavoriteMovie', () => {
    let request = {
        headers:{email:"abc@gmail.com"},
        body:{}
    }

    it('missing mandatory fields', async () => {
        request.body.title = "title"
        const req = mockReq(request)
        const res = mockRes()

        await setController.setFavoriteMovie(req, res)
        expect(res.json).to.be.calledWith({ success:false, msg:'imdbID, title and year mandatory' })
    })

    it('setFavoriteMovie duplicate', async () => {
        request.body.title = "title"
        request.body.imdbID = "imdbID"
        request.body.year = 2010

        const req = mockReq(request)
        const res = mockRes()

        const unset = setController.__set__('getDB', () => {
            return {
                collection: function() {
                    return { findOne: () => { return {} }}
                }
            }
        })

        await await setController.setFavoriteMovie(req, res)

        expect(res.json).to.be.calledWith({success:false, msg:"already added as favorite"})
        unset()
    })

    it('setFavoriteMovie success', async () => {
        request.body.title = "title"
        request.body.imdbID = "imdbID"
        request.body.year = 2010

        const req = mockReq(request)
        const res = mockRes()

        const unset = setController.__set__('getDB', () => {
            return {
                collection: function() {
                    return { 
                        findOne: () => { return  },
                        updateOne: () => { return {} }
                    } 
                }
            }
        })

        await await await setController.setFavoriteMovie(req, res)

        expect(res.json).to.be.calledWith({success:true})
        unset()
    })
})

describe('unSetFavoriteMovie', () => {
    let request = {
        headers:{email:"abc@gmail.com"},
        body:{}
    }

    it('missing mandatory fields', async () => {
        const req = mockReq(request)
        const res = mockRes()
        await setController.unSetFavoriteMovie(req, res)
        expect(res.json).to.be.calledWith({ success:false, msg:"imdbIDs mandatory"})
    })

    it('unSetFavoriteMovie success', async () => {
        request.body.imdbID = "imdbID"
        const req = mockReq(request)
        const res = mockRes()

        const unset = setController.__set__('getDB', () => {
            return {
                collection: function() {
                    return { updateOne: () => { return {} }}
                }
            }
        })

        await setController.unSetFavoriteMovie(req, res)
        expect(res.json).to.be.calledWith({ success:true })
        unset()
    })

})