import React, { Component } from "react";
import { Icon, Card } from 'antd';
import {favClick} from '../actions/movies'

const { Meta } = Card;

class MovieList extends Component {

	constructor(props) {
        super(props);
	}

    favClick = async (imdbID, title, year, isFav) => {
        if(imdbID) {
            let isUpdated = await favClick(imdbID, title, year, isFav)

            if(isUpdated)
                this.props.setFav(isFav)
        }
    }

	render() {
        const {data} = this.props

		return (
            <div style={filterStyle}>
                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt={data.Title} src={data.Poster} />}
                >
                    <Meta title={data.Title} description={data.Language}/>
                    <Meta description={data.Year} />
                    <div onClick={this.favClick.bind(this, data.imdbID, data.Title, data.Year, !data.isFav)}>
                        {
                            data.isFav ? 
                            <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96"/> :
                            <Icon type="heart" theme="twoTone"/>
                        }
                    </div>
                </Card> 
                <p>{data.Plot}</p>
            </div>
		);
	}
}

const filterStyle = {
    display: "flex",
    flexDirection: "row",
    backgroundColor: 'white', 
    padding: '40px', 
    margin:"0 auto"
    // justifyContent: "center",
    // padding:"40px",
    // padding: 24
}

export default MovieList;