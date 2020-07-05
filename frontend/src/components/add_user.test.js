import React from 'react';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import AddUser from '../components/add_user'

jest.unmock('../actions/user');
const user = require('../actions/user')

configure({adapter: new Adapter()});

describe('AddUser', () => {
    const add_user = mount(<AddUser />)
 
    it('check inital states', () => {
        user.addUser = jest.fn()
        add_user.find({type:"primary"}).simulate('click')
        expect(user.addUser).toHaveBeenCalledTimes(0)
    });

    it('check user addition', () => {
        user.addUser = jest.fn()

        add_user.find('input[placeholder="employee id"]')
        .simulate('change', { target: { value: 444 }});

        add_user.find('input[placeholder="name"]')
        .simulate('change', { target: { value: "test" }});

        add_user.find('input[placeholder="email"]')
        .simulate('change', { target: { value: "test@gmail.com" }});

        add_user.find('input[placeholder="default password"]')
        .simulate('change', { target: { value: "test" }});

        add_user.find('input[placeholder="role"]')
        .simulate('change', { target: { value: "admin" }});

        add_user.find({type:"primary"}).simulate('click')
        expect(user.addUser).toHaveBeenCalledTimes(1)
        expect(user.addUser).toHaveBeenCalledWith({"Email": "test@gmail.com", "EmpID": 444, "Name": "test", "Password": "test", "Role": "admin"})
    });

})