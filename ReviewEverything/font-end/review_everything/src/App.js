import React, { Component } from 'react';
import './App.css';
import StarRatingComponent from 'react-star-rating-component';
import Movies from './movies'; 

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { apiResponse: "", valueReview: "", valueRating: 0 };
    this.submitReview = this.submitReview.bind(this);
    this.changeRating = this.changeRating.bind(this);
    this.changeReview = this.changeReview.bind(this);
  }
  
  callAPI() {
    fetch("http://localhost:9000/home", {
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

  onStarClick(nextValue, prevValue, name) {
    this.setState({valueRating: nextValue});
  }
  
  submitReview(event) {
    alert('Your review stuff is this: ' + this.state.valueReview + " " + this.state.valueRating);
    event.preventDefault();

    const data = { review: this.state.valueReview, rating: this.state.valueRating }
    
    fetch('http://localhost:9000/home/submitReview', {
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
          </form>
        </header>
      </div>
    );
  }
}
export default App;
