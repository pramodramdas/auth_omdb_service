import React from 'react';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Route, Router, MemoryRouter } from 'react-router-dom';
import history from "./utils/history";
import App from './App';

jest.unmock('./actions/user');
const user = require('./actions/user')

jest.unmock('./utils/auth');
const auth = require('./utils/auth')

configure({adapter: new Adapter()});

describe('visit pages before login', () => {
    let historyPushSpy
    afterEach(() => {
        jest.resetModules()
    })

    beforeEach(() => {
        jest.resetModules()
        historyPushSpy = jest.spyOn(history, 'push');
    })

    afterEach(() => {
        historyPushSpy.mockClear()
        historyPushSpy.mockRestore()
    })

    it('navigation to / should redirect to /login', async () => {
        history.location.pathname = '/'
        await shallow(<App location={location} history={history} />);
        expect(historyPushSpy).toHaveBeenCalledWith('/login')
    })

    it('navigation to / should redirect to /adduser', async () => {
        history.location.pathname = '/adduser'
        await shallow(<App location={location} history={history} />);
        expect(historyPushSpy).toHaveBeenCalledWith('/login')     
    })

    it('navigation to / should redirect to /favorites', async () => {
        history.location.pathname = '/favorites'
        await shallow(<App location={location} history={history} />);
        expect(historyPushSpy).toHaveBeenCalledWith('/login')
    })
})

describe('visit pages after login', () => {
    let historyPushSpy;
    beforeAll(async () => {
        auth.checkSession = jest.fn(() => { return Promise.resolve(true) })
    })

    beforeEach(() => {
        jest.resetModules()
        historyPushSpy = jest.spyOn(history, 'push');
    })

    afterEach(() => {
        historyPushSpy.mockClear()
        historyPushSpy.mockRestore()
    })

    it('navigation to /adduser should not redirect to /login', async () => {
        history.location.pathname = '/adduser'
        await mount(
            <Router  initialEntries={['/adduser']} initialIndex={0} history={history}>
                <App location={{pathname:'/adduser'}} history={history}/>
            </Router>
        );

        expect(historyPushSpy).toHaveBeenCalledTimes(0)
    })

    it('navigation to /home should not redirect to /login', async () => {
        history.location.pathname = '/home'
        await mount(
            <Router  initialEntries={['/home']}  location={{pathname:'/home'}} history={history}>
                <App location={{pathname:'/home'}} history={history}/>
            </Router>
        );

        expect(historyPushSpy).toHaveBeenCalledTimes(0)
    })

    it('navigation to /favorites should not redirect to /login', async () => {
        history.location.pathname = '/favorites'
        await mount(
            <Router  initialEntries={['/favorites']}  location={{pathname:'/favorites'}} history={history}>
                <App location={{pathname:'/favorites'}} history={history}/>
            </Router>
        );

        expect(historyPushSpy).toHaveBeenCalledTimes(0)
    })
})

describe('APP login check', () => {
    let location = { pathname: '/' }
    let app;
    
    beforeEach(() => {
        app = shallow(<App location={location} history={history} />);
        jest.resetModules()  
    })

    it('check inital states', () => {
        expect(app.state().currentMenu).toEqual('1');
        expect(app.state().authenticated).toEqual(false);
    });

    it('check userLogin call', () => {
        user.userLogin = jest.fn((u, p) => { Promise.resolve({}) })
        app.instance().login("abc@gmail.com", "bbb")
        expect(user.userLogin).toHaveBeenCalledTimes(1)
        expect(user.userLogin).toHaveBeenCalledWith(...["abc@gmail.com", "bbb"])
    })

    it('check login success', async () => {
        const historyPushSpy = jest.spyOn(history, 'push');
        const data = {"Name":"abc","Email":"abc@gmail.com","Role":"admin","Token":"eyJhbGci"}
        user.userLogin = jest.fn((u, p) => { return Promise.resolve(data) })
        await app.instance().login("abc@gmail.com", "bbb")

        expect(localStorage.getItem('omdb')).toEqual(JSON.stringify(data))
        expect(app.state().authenticated).toEqual(true);
        expect(historyPushSpy).toHaveBeenCalledTimes(1);
        localStorage.clear()
        historyPushSpy.mockClear()
        historyPushSpy.mockRestore()
    })

    it('check login failed', async () => {
        const historyPushSpy = jest.spyOn(history, 'push');
        user.userLogin = jest.fn((u, p) => { return Promise.resolve(false) })
        await app.instance().login('', "bbb")

        expect(localStorage.getItem('omdb')).toEqual(null)
        expect(app.state().authenticated).toEqual(false);
        historyPushSpy.mockClear()
        historyPushSpy.mockRestore()
    })
});

