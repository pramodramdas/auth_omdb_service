const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

const rewire = require('rewire')
const { mockReq, mockRes } = require('sinon-express-mock')

var dbConfig = rewire('../config/db.js')
var getController = rewire('./get_controller.js')

const axios = require('axios')

describe('getFavoriteMovies', () => {
    let request = {
        body:{},
        headers:{email:"abc@gmail.com"}
    }

    before(() => {
        sinon.stub(console, 'log') 
    })

    it('getFavoriteMovies empty response', async () => {
        const req = mockReq(request)
        const res = mockRes()

        getController.__set__('getDB', () => {
            return {
                collection: function() {
                    return { findOne: () => { return new Promise((resolve) => { resolve() })}}
                }
            }
        })

        await getController.getFavoriteMovies(req, res)
        expect(res.json).to.be.calledWith({ favorites: [], success: false })
    })

    it('getFavoriteMovies error', async () => {
        const req = mockReq(request)
        const res = mockRes()

        getController.__set__('getDB', () => {
            return {
                collection: function() {
                    return { findOne: () => { throw new Error("mock error") }}
                }
            }
        })

        await getController.getFavoriteMovies(req, res)
        expect(res.json).to.be.calledWith({ msg: "error", success: false })
    })

    it('getFavoriteMovies success', async () => {
        const req = mockReq(request)
        const res = mockRes()

        getController.__set__('getDB', () => {
            return {
                collection: function() {
                    return { findOne: () => { return new Promise((resolve) => { resolve({favorites:[{"test": "test"}]}) })}}
                }
            }
        })

        await getController.getFavoriteMovies(req, res)
        expect(res.json).to.be.calledWith({ favorites: [{"test": "test"}], success: true })
    })
    
})


describe('checkFavorite', () => {
    let request = {
        headers:{email:"abc@gmail.com"}
    }

    it('missing mandatory parameters test1', async () => {
        const req = mockReq(request)
        const res = mockRes()

        await getController.checkFavorite(req, res)
        expect(res.json).to.be.calledWith({ msg:"imdbIDs missing", success: true })
    })

    it('missing mandatory parameters test2', async () => {
        request.query = {imdbIDs:'[]'}
        const req = mockReq(request)
        const res = mockRes()

        await getController.checkFavorite(req, res)
        expect(res.json).to.be.calledWith({ msg:"imdbIDs is empty", success: true })
    })

    it('checkFavorite empty response', async () => {
        request.query = {imdbIDs:'["123"]'}
        const req = mockReq(request)
        const res = mockRes()

        getController.__set__('getDB', () => {
            return {
                collection: function() {
                    return { findOne: () => { return new Promise((resolve, reject) => { return resolve() }) } }
                }
            }
        })
    
        await getController.checkFavorite(req, res)
        expect(res.json).to.be.calledWith({ success:true, favoritesList:[] })
    })

    it('checkFavorite check error', async () => {
        request.query = {imdbIDs:'[123]'}
        const req = mockReq(request)
        const res = mockRes()

        getController.__set__('getDB', () => {
            return {
                collection: function() {
                    return { findOne: () => { throw new Error("mock error") }}
                }
            }
        })
    
        await getController.checkFavorite(req, res)
        expect(res.json).to.be.calledWith({ success:false, msg:"error" })
    })

    it('checkFavorite success', async () => {
        request.query = {imdbIDs:'[123]'}
        const req = mockReq(request)
        const res = mockRes()

        getController.__set__('getDB', () => {
            return {
                collection: function() {
                    return { findOne: () => { return new Promise((resolve, reject) => { return resolve({favorites:[{imdbID:"a"}]}) }) } }
                }
            }
        })
    
        await getController.checkFavorite(req, res)
        expect(res.json).to.be.calledWith({ success:true, favoritesList:["a"] })
    })

})


describe('getMovieInfo', () => {
    let request = {
        query:{},
        headers:{email:"abc@gmail.com"}
    }

    before(() => {
        process.env.OMDB_URL = "http://test/"
        process.env.OMDB_API_KEY = "abc"
    })

    it('missing mandatory fields', async () => {
        const req = mockReq(request)
        const res = mockRes()

        await getController.getMovieInfo(req, res)
        expect(res.json).to.be.calledWith({ success:true, msg:"title or imdbID madatory" })
    })

    it('getMovieInfo check url', async () => {
        request.query.title = "title"
        request.query.year = 2010
        const req = mockReq(request)
        const res = mockRes()

        const stub = sinon.stub(axios, "get");

        await getController.getMovieInfo(req, res)
        expect(stub).to.be.calledWith(`${process.env.OMDB_URL}?apikey=${process.env.OMDB_API_KEY}&t=title&y=2010`)
        stub.restore();
    })

    it('getMovieInfo success', async () => {
        request.query.title = "title"
        request.query.year = 2010
        const req = mockReq(request)
        const res = mockRes()

        const stub = sinon.stub(axios, "get").resolves(Promise.resolve({data:{test:"test"}}));

        await getController.getMovieInfo(req, res)
        expect(res.json).to.be.calledWith({ success:true, data:{test:"test"} })
        stub.restore();
    })
})

describe('getPoster', () => {
    let request = {
        query:{}
    }

    before(() => {
        process.env.OMDB_URL = "http://test/"
        process.env.OMDB_API_KEY = "abc"
    })

    it('missing mandatory fields', async () => {
        const req = mockReq(request)
        const res = mockRes()

        await getController.getPoster(req, res)
        expect(res.json).to.be.calledWith({ success:false, msg:'imdbID mandataory' })
    })

    it('getPoster check url', async () => {
        request.query.imdbID = "imdbID"
        const req = mockReq(request)
        const res = mockRes()
        const stub = sinon.stub(axios, "get");
        
        await getController.getPoster(req, res)

        expect(stub).to.be.calledWith(`${process.env.OMDB_POSTER_URL}?apikey=${process.env.OMDB_API_KEY}&i=imdbID`)
        stub.restore();
    })

})