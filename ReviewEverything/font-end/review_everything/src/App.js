import React, { Component } from 'react';
import './App.css';

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { apiResponse: "", valueReview: "", valueRating: 0 };
    this.submitReview = this.submitReview.bind(this);
    this.changeRating = this.changeRating.bind(this);
    this.changeReview = this.changeReview.bind(this);
  }
  
  callAPI() {
    fetch("http://localhost:9000/test", {
      method: 'GET'
    })
      .then(response => response.text())
      .then(text => {
        console.log(text)
        this.setState({ apiResponse: text });
      })
  }
  
  componentWillMount() {
    this.callAPI();
  }

  changeReview(event) {
    this.setState({valueReview : event.target.value})
  }

  changeRating(event) {
    this.setState({valueRating : event.target.value})
  }
  
  submitReview(event) {
    alert('Your review stuff is this: ' + this.state.valueReview + " " + this.state.valueRating);
    event.preventDefault();
    // const form = event.target;
    // const reviewData = new FormData(form);

    const data = { review: this.state.valueReview, rating: this.state.valueRating }
    
    fetch('http://localhost:9000/test/submitReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
  
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <p>REVIEW OUR MOVIES!!!</p>
          <p>¯\_(ツ)_/¯</p>
          <form onSubmit={this.submitReview}>
            <label>What do think of movie? </label><input type='text' value={this.state.valueReview} onChange={this.changeReview}></input><br/>
            <label>What do rate movie? </label><input type='number' value={this.state.valueRating} onChange={this.changeRating}></input><br/>
            <input type='submit' value='Submit'></input>
          </form>
        </header>
        {/* <p className="App-intro">{this.state.apiResponse}</p> */}
      </div>
    );
}
}

export default App;
