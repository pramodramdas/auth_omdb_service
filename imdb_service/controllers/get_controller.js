const {getDB} = require("../config/db")
const {getTracer} = require("../config/zipkin")
const axios = require('axios')

const getFavoriteMovies = async (req, res) => {
    try {
        let tracer = getTracer()
        let { email } = req.headers// req.body

        let favObj
        // console.log(tracer.id.traceId, tracer.id.parentId)
        tracer.local('getFavoriteMovies get fav from db', async () => {
            favObj = await getDB().collection("imdb_user").findOne({email}, {projection: {"favorites":1, "_id":0}})
            
            if(!favObj || !favObj.favorites)
                return res.json({success:false, favorites:[]})
        
            return res.json({success:true, favorites:favObj.favorites})
        }).catch((err) => {
            console.log(err)
            res.status(500).json({success:false, msg:"error"})
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({success:false, msg:"error"})
    }
}

const checkFavorite = async (req, res) => {
    try {
        let { imdbIDs } = req.query
        let { email } = req.headers
        let tracer = getTracer()
        
        if(imdbIDs)
            imdbIDs = JSON.parse(imdbIDs)
        else
            return res.json({success:true, msg:"imdbIDs missing"})

        if(imdbIDs.length == 0)
            return res.json({success:true, msg:"imdbIDs is empty"})
        
        tracer.local('checkFavorite get fav from db', async () => {
            let fav = await getDB().collection("imdb_user").findOne({"email":email, 'favorites.imdbID':{"$in":imdbIDs}}, {"projection":{"favorites.$":1}})

            let favoritesList = []
            if(fav)
                favoritesList = fav.favorites.map(f => f["imdbID"])
            return res.json({success:true, favoritesList})
        }).catch((err) => {
            console.log(err)
            res.status(500).json({success:false, msg:"error"})
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({success:false, msg:"error"})        
    }
}

const getMovieInfo = async (req, res) => {
    try {
        let {title, year, plot} = req.query
        let tracer = getTracer()

        if(!title)
            return res.json({success:true, msg:"title or imdbID madatory"})
        
        let omdbUrl = `${process.env.OMDB_URL}?apikey=${process.env.OMDB_API_KEY}`
        
        if(title)
            omdbUrl = `${omdbUrl}&t=${title}`
        if(year)
            omdbUrl = `${omdbUrl}&y=${year}`
        if(plot)
            omdbUrl = `${omdbUrl}&plot=${plot}`

        tracer.local('getMovieInfo get fav from db', async () => {
            let response = await axios.get(omdbUrl)
            return res.json({success:true, data:response.data})
        }).catch((err) => {
            console.log(err)
            res.status(500).json({success:false, msg:"error"})
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({success:false, msg:"error"})
    }
}

const getPoster = async (req, res) => {
    try {
        let {imdbID} = req.query

        if(!imdbID)
            return res.json({success:false, msg:'imdbID mandataory'})
        
        let response = await axios.get(`${process.env.OMDB_POSTER_URL}?apikey=${process.env.OMDB_API_KEY}&i=${imdbID}`, {'responseType': 'arraybuffer'})

        res.send(response.data)
    } catch(err) {
        console.log(err)
        res.status(500).json({success:false, msg:"error"})
    }
}

module.exports = {
    getFavoriteMovies,
    checkFavorite,
    getMovieInfo,
    getPoster
} 