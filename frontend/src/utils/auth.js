import axios from 'axios'
import {getAuthServerUrl} from './util'
import {message} from 'antd'

export const checkSession = () => {
    return new Promise(async (resolve, reject) => {
        let omdb = localStorage.getItem('omdb')
        if(omdb) {
            omdb = JSON.parse(omdb)
            if(omdb.Token) {
                setAxiosHeader(omdb.Token)
                let authenticated = await axios.get(`${getAuthServerUrl()}isValidToken`)
                if(authenticated && authenticated.data && authenticated.data.Success)
                    return resolve(true)
            }
        }
        return resolve(false)
    })
}

const setAxiosHeader = (token) => {
    axios.defaults.headers.common["token"] = token
}

export const getToken = () => {
    return axios.defaults.headers.common["token"]
}

export const setSession = (data) => {
    if(data)
        localStorage.setItem('omdb', JSON.stringify(data))
}

export const clearSession = () => {
    localStorage.removeItem("omdb")
    setAxiosHeader()
}