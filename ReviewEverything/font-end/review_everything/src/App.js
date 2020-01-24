import React, { Component } from 'react';
import './App.css';
import StarRatingComponent from 'react-star-rating-component';
import Movies from './movies'; 

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
    fetch("http://localhost:9000/home", {
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
      .then(response => response.text())
      .then(text => {
        console.log('Login status: ' + text);
      })
  }
  
  hashPasswords(event) {
    event.preventDefault();
    
    fetch('http://localhost:9000/test/hash', {
      method: 'GET',
    })
      .then(response => response.text())
      .then(text => {
        console.log(text);
      })
  }
  
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <Movies></Movies>
          <p>REVIEW OUR MOVIES!!!</p>
          <p>¯\_(ツ)_/¯</p>
          <form onSubmit={this.submitReview}>
            <label>What do think of movie? </label><input type='text' value={this.state.valueReview} onChange={this.changeReview} class="in"></input><br/>
            <label>What do rate movie? </label>
            <StarRatingComponent name="starSystem" id="stars" starCount={5}
                  value={this.state.valueRating}
                  onStarClick={this.onStarClick.bind(this)}
                  onChange = {this.changeRating}/>
            <input type='submit' value='Submit'></input>
          </form> */}
          {/* <h1>Sign In</h1>
          <form onSubmit={this.checkLogin}>
            <label>Email: </label><input type='text' value={this.state.email} onChange={this.emailUpdate}></input><br/>
            <label>Password: </label><input type='text' value={this.state.password} onChange={this.passcodeUpdate}></input><br/>
            <input type='submit' value='Log In'></input>
          </form> */}
          <form onSubmit={this.hashPasswords}>
            <input type='submit' value='Hash Passwords'/>
          </form>
        </header>
      </div>
    );
  }
}
export default App;
