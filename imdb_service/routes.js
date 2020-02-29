const express = require('express');
const router = express.Router();
const {setFavoriteMovie, unSetFavoriteMovie, } = require("./controllers/set_controller")
const {getFavoriteMovies, checkFavorite, getMovieInfo, getPoster} = require("./controllers/get_controller")

router.get("/getFav", getFavoriteMovies)
router.get("/checkFavorite", checkFavorite)
router.get("/getMovieInfo", getMovieInfo)
router.get("/getPoster", getPoster)
router.post("/setFav", setFavoriteMovie)
router.post("/unsetFav", unSetFavoriteMovie)

module.exports = router;