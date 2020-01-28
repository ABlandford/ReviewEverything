import React, { Component, useImperativeHandle } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { apiResponse: "", valueReview: "", valueRating: 0, email: "", pasword: "" };
    // this.submitReview = this.submitReview.bind(this);
    // this.changeRating = this.changeRating.bind(this);
    // this.changeReview = this.changeReview.bind(this);
    this.emailUpdate = this.emailUpdate.bind(this);
    this.passcodeUpdate = this.passcodeUpdate.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
    this.hashPasswords = this.hashPasswords.bind(this);
  }
  
  callAPI() {
    fetch("http://localhost:9000/test", {
      method: 'GET'
    })
      .then(response => response.text())
      .then(text => {
        console.log(text);
        this.setState({ apiResponse: text });
      })
  }
  
  componentWillMount() {
    this.callAPI();
  }

  // changeReview(event) {
  //   this.setState({valueReview : event.target.value})
  // }

  // changeRating(event) {
  //   this.setState({valueRating : event.target.value})
  // }
  
  // submitReview(event) {
  //   alert('Your review stuff is this: ' + this.state.valueReview + " " + this.state.valueRating);
  //   event.preventDefault();
  //   // const form = event.target;
  //   // const reviewData = new FormData(form);

  //   const data = { review: this.state.valueReview, rating: this.state.valueRating }
    
  //   fetch('http://localhost:9000/test/submitReview', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data),
  //   });
  // }
  
  emailUpdate(event) {
    this.setState({email : event.target.value})
  }

  passcodeUpdate(event) {
    this.setState({password : event.target.value})
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({valueRating: nextValue});
  }
  
  checkLogin(event) {
    event.preventDefault();

    const data = { email: this.state.email, password: this.state.password }
    
    //fetch('http://localhost:9000/home/submitReview', {
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
      <div>
        <h1>Sign In</h1>
          <form onSubmit={this.checkLogin}>
            <label>Email: </label><input type='text' value={this.state.email} onChange={this.emailUpdate}></input><br/>
            <label>Password: </label><input type='password' value={this.state.password} onChange={this.passcodeUpdate}></input><br/>
            <input type='submit' value='Log In'></input>
          </form>
      </div>
    );
  }
}

// export default Login;

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = { valueReview: "", valueRating: 0, loggedin: true, user: {} };
    this.submitReview = this.submitReview.bind(this);
    this.changeRating = this.changeRating.bind(this);
    this.changeReview = this.changeReview.bind(this);
    this.logout = this.logout.bind(this);
  }

  changeReview(event) {
    this.setState({valueReview : event.target.value})
  }

  changeRating(event) {
    this.setState({valueRating : event.target.value})
  }
  
  submitReview(event) {
    event.preventDefault();

    const data = { userId: this.state.user.userId, userfname: this.state.user.fname, userlname: this.state.user.lname, review: this.state.valueReview, rating: this.state.valueRating }
    
    fetch('http://localhost:9000/test/hash', {
      method: 'GET',
    })
      .then(response => response.text())
      .then(text => {
        console.log(text);
      })
  }
  
  logout() {
    cookies.remove('currentUser');
    this.setState({ loggedin: false })
  }
  
  componentDidMount() {
    let currentUser = cookies.get('currentUser');
    this.setState({ user: { fname: currentUser.fname, lname: currentUser.lname, userId: currentUser._id } });
  }
  
  render() {
    if(this.state.loggedin === false) {
      return <Redirect to='/'/>
    }
    return(
      <div>
        <h1>Home</h1>
          <p>Welcome home {this.state.user.fname}!</p>
        <section>
          <p>REVIEW OUR MOVIES!!!</p>
          <p>¯\_(ツ)_/¯</p>
            <form onSubmit={this.submitReview}>
              <label>What do think of movie? </label><input type='text' value={this.state.valueReview} onChange={this.changeReview}></input><br/>
              <label>What do rate movie? </label><input type='number' value={this.state.valueRating} onChange={this.changeRating}></input><br/>
              <input type='submit' value='Submit'></input>
            </form>
        </section>
        <section>
          <button onClick = {() => {
            this.logout();
          }}>Logout</button>
        </section>
      </div>
    );
  }
}
export default App;
