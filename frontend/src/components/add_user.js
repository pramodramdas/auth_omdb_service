import React, { Component } from "react";
import { Input, Button, message, InputNumber } from 'antd';
import {addUser} from '../actions/user';

class AddUser extends Component {

	constructor(props) {
        super(props);
        this.email = React.createRef()
        this.password = React.createRef()
        this.name = React.createRef()
        this.empId = React.createRef()
        this.role = React.createRef()
        this.age = React.createRef()
	}

    addUser() {
        let Email = this.email.current.state.value
        let Password = this.password.current.state.value
        let Name = this.name.current.state.value
        let EmpID = this.empId.current.state.value
        let Role = this.role.current.state.value
        let Age = this.age.current.inputNumberRef.state.value

        if(!Email)
            return message.error('email mandatory')
        if(!Password)
            return message.error('password mandatory')
        if(!Name)
            return message.error('name mandatory')
        if(!EmpID)
            return message.error('empId mandatory')
        if(!Role)
            return message.error('role mandatory')
        
        addUser({Email, Password, Name, EmpID, Role})
    }

	render() {
		return (
            <div style={{width:"400px", backgroundColor: 'white', padding: '40px', margin:"0 auto"}}>
                <Input placeholder="employee id" ref={this.empId} style={{marginBottom:'30px'}}/>
                <Input placeholder="name" ref={this.name} style={{marginBottom:'30px'}}/>
                <Input placeholder="email" ref={this.email} style={{marginBottom:'30px'}}/>
                <Input placeholder="default password" ref={this.password} style={{marginBottom:'30px'}} />
                <Input placeholder="role" ref={this.role} style={{marginBottom:'30px'}} />
                <InputNumber ref={this.age} placeholder="age" min={1} max={100} style={{marginBottom:'30px'}}/>
                <Button type="primary" onClick={this.addUser.bind(this)}>Add User</Button>
            </div>
		);
	}
}

export default AddUser;