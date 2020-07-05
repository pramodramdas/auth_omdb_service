import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { message } from 'antd';
const user = require('./user')

describe('userLogin', () => {
    it('userLogin failure', async () => {
        const mock = new MockAdapter(axios);
        mock.onPost('/user/login', {email:null, password:null}).reply(200, {Success:false});

        let result = await user.userLogin(null, null)

        expect(result).toEqual(false)
    })

    it('userLogin success', async () => {
        const mock = new MockAdapter(axios);
        mock.onPost('/user/login', {email:"abc@gmail.com", password:"bbb"}).reply(200, {Success:true});

        let result = await user.userLogin("abc@gmail.com", "bbb")

        expect(result).toEqual({Success:true})
    })
})

describe('addUser', () => {
    it('addUser failure', async () => {
        const antdMessageErrorSpy = jest.spyOn(message, "error")
        const mock = new MockAdapter(axios);
        mock.onPost('/user/api/addUser', {}).reply(200, {Msg:"addUser error", Success:false});

        let result = await user.addUser({})

        expect(antdMessageErrorSpy).toHaveBeenCalledWith("addUser error")
        antdMessageErrorSpy.mockClear()
        antdMessageErrorSpy.mockRestore()
    })

    it('addUser success', async () => {
        const antdMessageSuccessSpy = jest.spyOn(message, "success")
        const mock = new MockAdapter(axios);
        mock.onPost('/user/api/addUser', {}).reply(200, {Msg:"addUser success", Success:true});

        let result = await user.addUser({})

        expect(antdMessageSuccessSpy).toHaveBeenCalledWith("addUser success")
        antdMessageSuccessSpy.mockClear()
        antdMessageSuccessSpy.mockRestore()
    })
})