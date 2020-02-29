import React, { Component } from 'react';
import { Card, Icon, Avatar } from 'antd';
import {getFav, favClick} from '../actions/movies'
import {getServerUrl} from '../utils/util'
import {getToken} from '../utils/auth'

const { Meta } = Card;

class Favorites extends Component {

	constructor(props) {
        super(props);
        this.state = {
            favorites:[]
        }
    }

    componentDidMount() {
        this.getFav()
    }

    getFav = async () => {
        let favorites = await getFav()
        this.setState({favorites})
    }

    favClick = async (imdbID, title, year, isFav) => {
        if(imdbID) {
            let isUpdated = await favClick(imdbID, title, year, isFav)
            if(isUpdated)
                this.getFav()
        }
    }

    render() {
        let {favorites} = this.state
        let that = this
        return(
            <div>
                <Card title="My Favorites">
                    {
                        favorites.map((fav) => {
                            return <Card.Grid style={gridStyle}>
                                <Card
                                    cover={
                                        <img
                                            alt="example"
                                            src={`${getServerUrl()}getPoster?imdbID=${fav.imdbID}&token=${getToken()}`}
                                        />
                                    }
                                    actions={[
                                        <Icon 
                                            type="heart" 
                                            theme="twoTone" 
                                            twoToneColor="#eb2f96"
                                            onClick={that.favClick.bind(that, fav.imdbID, fav.title, fav.year, false)}
                                        />
                                    ]}
                                >
                                    <Meta
                                        title={fav.title}
                                        description={fav.year}
                                    />
                                </Card>
                            </Card.Grid>
                        })
                    }
                </Card>
            </div>
        )
    }
}

const gridStyle = {
    width: '15%',
    textAlign: 'center'
};

export default Favorites;