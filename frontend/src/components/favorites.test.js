import React from 'react';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Favorites from '../components/favorites'

jest.unmock('../actions/movies');
const movies = require('../actions/movies')

configure({adapter: new Adapter()});

describe('Home', () => {
    const favorites = mount(<Favorites />)
    const favItems = [{"title":"The Avengers","year":"2012","imdbID":"tt0848228"},{"title":"The Hobbit: An Unexpected Journey","year":"2012","imdbID":"tt0903624"}]
    
    it('check inital states', () => {
        expect(favorites.state().favorites).toEqual([]);
    });

    it('getFav', async () => {
        movies.getFav = jest.fn(() => { return Promise.resolve(favItems) })

        await favorites.instance().getFav()
        expect(favorites.state().favorites.length).toEqual(2);
    })

    it('favClick success', async () => {
        movies.favClick = jest.fn(() => { return Promise.resolve(true) })
        const getFavSpy = jest.spyOn(favorites.instance(), 'getFav');

        await favorites.instance().favClick("tt0903624")
        
        expect(getFavSpy).toHaveBeenCalledTimes(1)
        getFavSpy.mockClear()
        getFavSpy.mockRestore()
    })

    it('favClick failure', async () => {
        movies.favClick = jest.fn(() => { return Promise.resolve(false) })
        const getFavSpy = jest.spyOn(favorites.instance(), 'getFav');
        
        await favorites.instance().favClick()
        expect(getFavSpy).toHaveBeenCalledTimes(0)

        await favorites.instance().favClick()
        expect(getFavSpy).toHaveBeenCalledTimes(0)
        getFavSpy.mockClear()
        getFavSpy.mockRestore()
    })

});
