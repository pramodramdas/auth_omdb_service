import axios from 'axios'
import {getServerUrl} from '../utils/util'

export const searchMovie = ({title, year}) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!title)
                return reject("title mandatory")
            
            let url = `${getServerUrl()}getMovieInfo?title=${title}`

            if(year)
                url = `${url}&year=${year}`
            
            url = `${url}&plot=full`

            let result = await axios.get(url)

            if(result && result.data && result.data.data && result.data.data.Response !== "False")
                resolve(result.data && result.data.data)
            else
                resolve({})
        } catch(err) {
            console.log(err)
            resolve({})
        }
    })
}

export const checkFav = (imdbID) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!imdbID)
                return reject("imdbID mandatory")
        
            let url = `${getServerUrl()}checkFavorite?imdbIDs=["${imdbID}"]`

            let result = await axios.get(url)

            if(result && result.data && result.data.favoritesList && result.data.favoritesList[0] == imdbID)
                resolve(true)
            else
                resolve(false)
        } catch(err) {
            console.log(err)
            resolve(false)
        }
    })
}

export const favClick = (imdbID, title, year, isFav) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!imdbID)
                return reject("imdbID mandatory")
            
            let url = `${getServerUrl()}`

            if(isFav)
                url = `${url}setFav/`
            else
                url = `${url}unsetFav/`

            let result = await axios.post(url, {imdbID, title, year})

            if(result && result.data && result.data.success)
                resolve(true)
            else
                resolve(false)
        } catch(err) {
            console.log(err)
            resolve(false)
        }
    })
}

export const getFav = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let url = `${getServerUrl()}getFav`

            let result = await axios.get(url)

            if(result && result.data && result.data.favorites)
                resolve(result.data.favorites)
            else
                resolve([])
        } catch(err) {
            console.log(err)
            resolve([])
        }
    })
}
