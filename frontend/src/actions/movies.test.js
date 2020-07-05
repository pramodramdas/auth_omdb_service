import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
const movies = require('./movies')

describe('searchMovie', () => {
    it('check validation reject searchMovie ', () => {
        movies.searchMovie({}).catch((err) => {
            expect(err).toEqual("title mandatory")
        })
    })

    it('searchMovie failure', async () => {
        const mock = new MockAdapter(axios);
        mock.onGet('/imdb/getMovieInfo?title=hobbit&plot=full').reply(200, {data:{Response:"False"}});

        let result = await movies.searchMovie({title:'hobbit'})

        expect(result).toEqual({})
    })

    it('searchMovie success', async () => {
        const mock = new MockAdapter(axios);
        const responseData = {test:"test"}
        mock.onGet('/imdb/getMovieInfo?title=hobbit&plot=full').reply(200, {data:responseData});

        let result = await movies.searchMovie({title:'hobbit'})

        expect(result).toEqual(responseData)
    })
})

describe('checkFav', () => {
    it('check validation reject checkFav ', () => {
        movies.checkFav().catch((err) => {
            expect(err).toEqual("imdbID mandatory")
        })
    })

    it('checkFav failure', async () => {
        const mock = new MockAdapter(axios);
        mock.onGet('/imdb/checkFavorite?imdbIDs=["abbbb"]').reply(200, {favoritesList:["uiui"]});

        let result = await movies.checkFav("abbbb")

        expect(result).toEqual(false)
    })

    it('checkFav success', async () => {
        const mock = new MockAdapter(axios);
        const responseData = {favoritesList:["abbbb"]}
        mock.onGet('/imdb/checkFavorite?imdbIDs=["abbbb"]').reply(200, responseData);

        let result = await movies.checkFav("abbbb")

        expect(result).toEqual(true)
    })
})


describe('favClick', () => {
    it('check validation reject favClick ', () => {
        movies.favClick().catch((err) => {
            expect(err).toEqual("imdbID mandatory")
        })
    })

    it('favClick failure', async () => {
        const mock = new MockAdapter(axios);
        mock.onPost('/imdb/setFav/', {"imdbID": "abbbb", "title": null, "year": null}).reply(200, {success:false});

        let result = await movies.favClick("abbbb", null, null, true)

        expect(result).toEqual(false)
    })

    it('favClick success', async () => {
        const mock = new MockAdapter(axios);
        mock.onPost('/imdb/setFav/', {"imdbID": "abbbb", "title": null, "year": null}).reply(200, {success:true});

        let result = await movies.favClick("abbbb", null, null, true)

        expect(result).toEqual(true)
    })

    it('favClick check set and unset', async () => {
        const mock = new MockAdapter(axios);
        mock.onPost('/imdb/setFav/', {"imdbID": "abbbb", "title": null, "year": null}).reply(200, {success:true});
        mock.onPost('/imdb/unsetFav/', {"imdbID": "abbbb", "title": null, "year": null}).reply(200, {success:true});

        const axiosPostSpy = jest.spyOn(axios, "post")

        await movies.favClick("abbbb", null, null, true)

        expect(axiosPostSpy).toHaveBeenCalledWith('/imdb/setFav/', {"imdbID": "abbbb", "title": null, "year": null})
        
        await movies.favClick("abbbb", null, null, false)

        expect(axiosPostSpy).toHaveBeenCalledWith('/imdb/unsetFav/', {"imdbID": "abbbb", "title": null, "year": null})
        axiosPostSpy.mockClear()
        axiosPostSpy.mockRestore()
    })
})

describe('getFav', () => {
    it('getFav failure', async () => {
        const mock = new MockAdapter(axios);
        mock.onGet('/imdb/getFav').reply(200, {});

        let result = await movies.getFav()

        expect(result).toEqual([])
    })

    it('getFav success', async () => {
        const mock = new MockAdapter(axios);
        const responseData = {favorites:[{},{}]}
        mock.onGet('/imdb/getFav').reply(200, responseData);

        let result = await movies.getFav()

        expect(result.length).toEqual(2)
    })
})