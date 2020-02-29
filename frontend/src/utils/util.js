// const urls = {
//     "imdb": "http://localhost:4444/imdb/",
//     "user": "http://localhost:8089/"
// }

const urls = {
    "imdb": "/imdb/",
    "user": "/user/"
}

export const getServerUrl = () => {
    return urls.imdb
}

export const getAuthServerUrl = () => {
    return urls.user
}