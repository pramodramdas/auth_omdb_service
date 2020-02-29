const MongoClient = require('mongodb').MongoClient;
let db;

const dbInit = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let database = await MongoClient.connect(process.env.DB_URL, {
                reconnectTries: Number.MAX_VALUE,
                reconnectInterval: 1000
            })

            db = database.db(process.env.DB_NAME);
            resolve()
        } catch(err) {
            console.log(err)
            reject(err)
        }
    })
}

const getDB = () => {
    return db
}

module.exports = {
    dbInit,
    getDB
}