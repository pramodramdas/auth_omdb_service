import React, { Component } from 'react';
import { Switch, Route, Prompt } from 'react-router-dom';
import Home from './components/home'
import Login from './components/login'
import AddUser from './components/add_user'
import Favorites from './components/favorites'
import {checkSession, clearSession, setSession} from './utils/auth'
import {userLogin} from './actions/user';

import { Layout, Menu, Button } from 'antd';

import './App.css';
import "../node_modules/antd/dist/antd.css";
// import axios from 'axios'
// axios.defaults.headers.common["user"] = "abc@gmail.com"

const { Header, Content } = Layout;

class App extends Component {

	state = {
		currentMenu: '1',
		authenticated:false
	}

	componentWillMount() {
		let {pathname} = this.props.location
		let currentMenu = this.state.currentMenu

		if(pathname == '/home')
			currentMenu = '1'
		else if(pathname == '/favorites')
			currentMenu = '2'
		else if(pathname == '/adduser')
			currentMenu = '3'

		this.setState({currentMenu})
	}

	async componentDidMount() {
		let authenticated = await checkSession()
		if(authenticated) {
			if(this.props.location.pathname === '/login' || this.props.location.pathname === '/')
				this.props.history.push('/home')
			else
				this.setState({authenticated})
		}
		else {
			this.props.history.push('/login')
		}
	}

	changeMenu = ({key}) => {
		this.setState({currentMenu:key}, () => {
			if(key == '1')
				this.props.history.push('/home')
			if(key == '2')
				this.props.history.push('/favorites')
			else if(key == '3')
				this.props.history.push('/adduser')
		})
	}

	logout = () => {
		clearSession()
		this.setState({authenticated:false})
		this.props.history.push('/login')
	}

	login = async (email, password) => {
        //this.email.current.state.value
        let data = await userLogin(email, password)

        if(data) {
			setSession(data)
			this.setState({authenticated:true})
            this.props.history.push('/home')
        }
    }

	render() {
		let {authenticated} = this.state
		let {pathname} = this.props.location

		return (
			<div className="App">
				<Layout>
					{
						authenticated ?
						<Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
							<div className="logo" />
							<Menu
								theme="dark"
								mode="horizontal"
								defaultSelectedKeys={[this.state.currentMenu]}
								style={{ lineHeight: '64px' }}
								onClick={this.changeMenu}
							>
								<Menu.Item key="1">Home</Menu.Item>
								<Menu.Item key="2">Favorites</Menu.Item>
								<Menu.Item key="3">Add User</Menu.Item>
								<Button type="primary" style={{"float":"right", "marginTop":"15px"}} onClick={this.logout}>LOGOUT</Button>
							</Menu>
						</Header> :
						null
					}
					{
						(authenticated || (pathname == '/login' || pathname == '/')) ?
						<Content style={{ padding: '0 50px', marginTop: 100, minHeight: 500 }}>
							<Switch>
								<Route exact path="/" component={Login} />
								<Route exact path="/login" component={(props) => (<Login {...props} login={this.login} />)}/>
								<Route exact path="/home" component={Home} />
								<Route exact path="/adduser" component={AddUser} />
								<Route exact path="/favorites" component={Favorites} />
							</Switch>
						</Content> :
						null
					}
				</Layout>
				<Prompt when={true} message={ (location) => location.pathname} />
			</div>
		);
	}
}

export default App;
