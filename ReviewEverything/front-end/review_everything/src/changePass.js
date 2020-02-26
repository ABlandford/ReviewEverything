import React, {Component} from 'react';
import './App.css';
import { Redirect, useHistory } from 'react-router-dom';


export default class changePassword extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: null,  temp_params: "", name: "" };
        this.sendPass = this.sendPass.bind(this);
        this.emailMethod = this.emailMethod.bind(this); 
        // history = useHistory();
        this.addLocked = this.addLocked.bind(this); 
        this.setPass = this.setPass.bind(this); 
    }

    backHome() {
        this.setState({redirect: "/"})
    }

    setPass(event){
      this.setState({temp_params: event.target.value})
    }
  

   sendPass(event){
     event.preventDefault(); 
     const data = { email: this.state.temp_params };
     fetch('http://localhost:9000/test/changePassword', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify(data),
         }) 
         .then(response => response.json())
             .then(json => {
                 console.log(json.userLog+" #####");
                 console.log(json.userPass)
                 this.setState({name: json.userLog})
                 console.log(this.state.name)
                 
             })
    console.log(this.state.temp_params+"!!!")
    


  }
 
    render() {

      if(this.state.redirect) { 
        return <Redirect to={ this.state.redirect }/> 
      }

      return(
        <div>
            <h1>Change Password {this.state.name}</h1>
            <form onSubmit={this.sendPass}>
            <label>Your New Password: <input type="text" onChange={this.setPass}></input></label><br/><br/>
            <button type='submit'>Send</button>
            <button className='back' onClick={() => {
                this.backHome()
              }}>Cancel
            </button>
            </form>
        </div>
    )}
}