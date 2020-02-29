import React, { Component } from "react";
import { Input, Button } from 'antd';

class Login extends Component {

	constructor(props) {
        super(props);
        this.email = React.createRef()
        this.password = React.createRef()
    }

    login = () => {
        this.props.login(this.email.current.state.value, this.password.current.state.value)
    }
    
	render() {
		return (
            <div style={{width:"400px", backgroundColor: 'white', padding: '40px', margin:"0 auto"}}>
                <Input placeholder="email" ref={this.email} style={{marginBottom:'30px'}}/>
                <Input placeholder="password" ref={this.password} style={{marginBottom:'30px'}} />
                <Button type="primary" onClick={this.login}>LOGIN</Button>
            </div>
		);
	}
}

export default Login;