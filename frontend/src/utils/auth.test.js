import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
const auth = require('./auth')

describe('checkSession', () => {
    it('checkSession failure no token in localstorage', async () => {
        let result = await auth.checkSession()

        expect(result).toEqual(false)
    })

    it('checkSession failure with token in localstorage', async () => {
        localStorage.setItem('omdb', JSON.stringify({Token:"abc"}))
        const mock = new MockAdapter(axios);
        const responseData = {Success:false}
        mock.onGet('/user/isValidToken').reply(200, responseData);

        let result = await auth.checkSession()

        expect(result).toEqual(false)
        localStorage.clear()
    })


    it('checkSession success with token in localstorage', async () => {
        localStorage.setItem('omdb', JSON.stringify({Token:"abc"}))
        const mock = new MockAdapter(axios);
        const responseData = {Success:true}
        mock.onGet('/user/isValidToken').reply(200, responseData);

        let result = await auth.checkSession()

        expect(result).toEqual(true)
        localStorage.clear()
    })
})

describe('check axios token', () => {
    it('setAxiosHeader get token', async () => {
        localStorage.setItem('omdb', JSON.stringify({Token:"abc"}))
        const mock = new MockAdapter(axios);
        const responseData = {Success:true}
        mock.onGet('/user/isValidToken').reply(200, responseData);

        await auth.checkSession()
        let token = auth.getToken()

        expect(token).toEqual("abc")
        expect(axios.defaults.headers.common["token"]).toEqual("abc")
        localStorage.clear()
    })
})

describe('check session', () => {
    it('setSession no data', () => {
        auth.setSession()

        expect(localStorage.getItem('omdb')).toEqual(null)
    })

    it('setSession with data', () => {
        auth.setSession({Token:"abc"})

        expect(localStorage.getItem('omdb')).toEqual(JSON.stringify({Token:"abc"}))
    })

    it('checkSession', async () => {
        localStorage.setItem('omdb', JSON.stringify({Token:"abc"}))
        const mock = new MockAdapter(axios);
        const responseData = {Success:true}
        mock.onGet('/user/isValidToken').reply(200, responseData);

        await auth.checkSession()
        auth.clearSession()

        expect(localStorage.getItem('omdb')).toEqual(null)
        expect(axios.defaults.headers.common["token"]).toEqual(undefined)
        localStorage.clear()
    })
})