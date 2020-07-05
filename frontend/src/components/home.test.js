import React from 'react';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Home from '../components/home'

jest.unmock('../actions/movies');
const movies = require('../actions/movies')

configure({adapter: new Adapter()});

describe('Home', () => {
    const home = mount(<Home />)
    const data = {"Title":"The Hobbit: An Unexpected Journey","Year":"2012", "imdbRating":"7.8","imdbVotes":"741,391","imdbID":"tt0903624"}
    
    it('check inital states', () => {
        expect(home.state().movieData).toEqual({});
    });

    it('searchMovie', async () => {
        const onSearchSpy = jest.spyOn(home.instance(), 'onSearch');
        
        movies.searchMovie = jest.fn(() => { return Promise.resolve(data) })

        home.find('input[placeholder="movie name"]')
        .simulate('change', { target: { value: "hobbit" }});

        await home.find({type:"primary"}).simulate('click')

        expect(onSearchSpy).toHaveBeenCalledWith("hobbit")

        const movieData = home.state().movieData;

        expect(JSON.stringify(movieData)).toEqual(JSON.stringify(data))

        onSearchSpy.mockClear()
        onSearchSpy.mockRestore()
    })

    it('checkFav', async () => {
        movies.checkFav = jest.fn(() => { return Promise.resolve(true) })

        await home.instance().checkFav("tt0903624")
        const movieData = home.state().movieData;

        expect(JSON.stringify(movieData.isFav)).toEqual("true")
    })

    it('setFav', async () => {
        await home.instance().setFav(true)
        let movieData = home.state().movieData;

        expect(JSON.stringify(movieData.isFav)).toEqual("true")

        home.instance().setFav(false)
        movieData = home.state().movieData;

        expect(JSON.stringify(movieData.isFav)).toEqual("false")
    })

});
