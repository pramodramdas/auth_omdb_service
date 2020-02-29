require('dotenv').config();
const express = require("express")
const  bodyParser = require('body-parser')
const cors = require('cors');
const zipkinMiddleware = require("zipkin-instrumentation-express").expressMiddleware;

const imdbRouter = require('./routes');
const {dbInit} = require("./config/db")
const {checkUser} = require("./utils/auth")
const {getTracer} = require("./config/zipkin")
const app = express()

app.use(bodyParser.json())
app.use(zipkinMiddleware({ tracer:getTracer() }));
app.use(cors());

app.use(checkUser)
app.use('/imdb', imdbRouter)

dbInit().then(() => {
    console.log("dbInit success")
    app.listen(process.env.HTTP_PORT, () => {
        console.log(`imdb server is running at ${process.env.HTTP_PORT}`)
    })
})