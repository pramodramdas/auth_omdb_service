import React from 'react';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import history from "../utils/history";
import Login from '../components/login'

configure({adapter: new Adapter()});

describe('Login', () => {
    const loginFunc = jest.fn()
    const location = { pathname: '/login' }
    const login = mount(<Login location={location} history={history} login={loginFunc}/>)

    it('check login submit', () => {        
        login.find('input[placeholder="email"]')
        .simulate('change', { target: { value: "abc@gmail.com" }});

        login.find('input[placeholder="password"]')
        .simulate('change', { target: { value: "bbb" }});

        login.find({type:"primary"}).simulate('click')

        expect(loginFunc).toHaveBeenCalledWith(...["abc@gmail.com", "bbb"])
    })
});
