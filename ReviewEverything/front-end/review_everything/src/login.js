import React, {Component} from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = { username: "", password: "", redirect: null };
    this.usernameUpdate = this.usernameUpdate.bind(this);
    this.passcodeUpdate = this.passcodeUpdate.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
    this.redirectToSignUp = this.redirectToSignUp.bind(this);
    // this.addAdmin = this.addAdmin.bind(this);
  }
  
//   addAdmin(event) {
//     event.preventDefault();

//     fetch('http://localhost:9000/test/addAdmin', {
//       method: 'GET',
//     });
//   }
  
  redirectToSignUp(event) {
    event.preventDefault();

    this.setState({ redirect: '/signup' });
  }

  usernameUpdate(event) {
    this.setState({username : event.target.value})
  }
  
  passcodeUpdate(event) {
    this.setState({password : event.target.value})
  }
  
  checkLogin(event) {
    event.preventDefault();
    const data = { username: this.state.username, password: this.state.password }

    fetch('http://localhost:9000/test/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(json => {
        if(json.status === true) {
          console.log('Login status: ' + json.status);
          console.log(json.user); 
          cookies.set('currentUser', JSON.stringify(json.user), {path: '/'});
          this.setState({ redirect: '/home' })
        } else {
          console.log('Login status: ' +  json.status);
          console.log('The information you entered was incorrect. See status message below.');
          console.log(json.statusMessage);
          alert(json.statusMessage); 
        }
      })
  }
  
  
  render() {
    if(this.state.redirect) { 
      return <Redirect to={ this.state.redirect }/> 
    }
    return(
      <div class='login-display'>
        <div class='login-header-container'>
          <h1 class='login-header'>Login</h1>
        </div>
        <div class='login-form'>
          <form onSubmit={this.checkLogin}>
            <label>Username: <input class='login-input' type='text' value={this.state.username} onChange={this.usernameUpdate}></input></label><br/>
            <label>Password: <input class='login-input' type='password' value={this.state.password} onChange={this.passcodeUpdate}></input></label><br/>
            <input class='login-submit' type='submit' value='Log In'></input>
          </form>
          <form onSubmit={ this.redirectToSignUp }>
            <input class='tosignup-submit' type='submit' value='Sign Up'></input>
          </form>
        </div>
          {/* <form onSubmit={this.addAdmin}>
            <input type='submit' value='Add Admin'/>
          </form> */}
      </div>
    );
  }
}