import axios from 'axios';
import {getAuthServerUrl} from '../utils/util'
import { message } from 'antd';

export const userLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        let result = await axios.post(`${getAuthServerUrl()}login`, {email, password})
        
        if(result && result.data && result.data.Success !== false) {
            resolve(result.data)
        }
        else {
            if(result.data.Msg)
                message.error(result.data.Msg)
            resolve(false)
        }
    })
}

export const addUser = async (data) => {
    let result = await axios.post(`${getAuthServerUrl()}api/addUser`, data)

    if(result && result.data && result.data.Msg) {
        if(result.data.Success)
            message.success(result.data.Msg)
        else
            message.error(result.data.Msg)
    }
}