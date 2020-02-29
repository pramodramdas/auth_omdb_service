const {getDB} = require("../config/db")
const {getTracer} = require("../config/zipkin")

const setFavoriteMovie = async (req, res) => {
    try {
        let tracer = getTracer()
        let { email } = req.headers
        let { title, year, imdbID } = req.body
        
        if(!title || !year || !imdbID)
            return res.json({success:false, msg:"imdbID, title and year mandatory"})

        let exists
        tracer.scoped(() => {
            return tracer.local('setFavoriteMovie check if fav exists in db', async () => {
                exists = await getDB().collection("imdb_user").findOne({email, favorites: { $elemMatch: { imdbID } } })
                return exists
            })
        }).then((exists) => {
            if(exists)
                return res.json({success:false, msg:"already added as favorite"})

            tracer.scoped(async () => {
                return tracer.local('setFavoriteMovie save fav to db', async () => {
                    await getDB().collection("imdb_user").updateOne({email}, {"$push":{favorites: {title, year, imdbID}}}, {upsert:true})
                    return res.json({success:true})
                })
            })
        }).catch((err) => {
            console.log(err)
            res.status(500).json({success:false, msg:"error"})
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({success:false, msg:"error"})
    }
}

const unSetFavoriteMovie = async (req, res) => {
    try {
        let { email } = req.headers
        let { imdbID } = req.body
        
        if(!imdbID)
            return res.json({success:false, msg:"imdbIDs mandatory"})
    
        let tracer = getTracer()
        await tracer.local('unSetFavoriteMovie unset fav in db', async () => {
            await getDB().collection("imdb_user").updateOne({email}, {"$pull":{"favorites":{imdbID}}})
        })

        return res.json({success:true})        
    } catch(err) {
        console.log(err)
        res.status(500).json({success:false, msg:"error"})
    }
}

module.exports = {
    setFavoriteMovie,
    unSetFavoriteMovie
} 