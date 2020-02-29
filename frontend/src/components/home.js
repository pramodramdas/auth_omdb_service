import React, { Component } from "react";
import { Input, InputNumber } from 'antd';
import MovieList from './movie_list'
import {searchMovie, checkFav} from '../actions/movies'

const { Search } = Input;

class Home extends Component {

	constructor(props) {
        super(props);
        this.movieName = React.createRef()
        this.year = React.createRef()
        this.state = {
            movieData: {}
        }
	}

    onSearch = async (movieName) => {
        let params = {}

        if(movieName)
            params.title = movieName
        if(this.year.current.inputNumberRef.state.value)
            params.year = this.year.current.inputNumberRef.state.value
        
        if(params.title) {
            let data = await searchMovie(params)
            if(data) {
                this.setState({movieData:data})
                this.checkFav(data.imdbID)
            }
        }
    }

    checkFav = async (imdbID) => {
        if(imdbID) {
            let isFav = await checkFav(imdbID)
            this.setState({movieData:{...this.state.movieData, isFav}})
        }
    }

    setFav = (isFav) => {
        this.setState({movieData:{...this.state.movieData, isFav}})
    }

	render() {
		return (
            <div style={{ background: '#fff', height: '500px'}}>
                <div style={filterStyle}>
                    <InputNumber  ref={this.year} placeholder="year" min={1900} max={(new Date()).getFullYear()} style={{width:'10%', height:'40px', padding: '2px 5px'}}/>
                    <Search
                        ref={this.movieName}
                        placeholder="movie name"
                        enterButton="Search"
                        size="large"
                        onSearch={value => this.onSearch(value)}
                        style={{width:'60%', height:'10%', marginLeft:'15px'}}
                    />
                </div>
                {
                    (this.state.movieData && Object.keys(this.state.movieData).length > 0) ?
                    <MovieList style={{width: '100%'}} data={this.state.movieData} setFav={this.setFav} /> :
                    null
                }
            </div>
		);
	}
}

const filterStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding:"40px",
    padding: 24
}

export default Home;