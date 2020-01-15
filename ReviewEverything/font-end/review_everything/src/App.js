import React, { Component } from 'react';
import './App.css';

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
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

  render(){
  return (
    <div className="App">
      <header className="App-header">
        <p>REVIEW OUR MOVIES!!!</p>
        <p>¯\_(ツ)_/¯</p>
        <form>
          <label>What do think of movie? </label><input type='text'></input><br/>
          <label>What do rate movie? </label><input type='number'></input><br/>
          <input type='submit'></input>
        </form>
      </header>
      <h1>BRUH</h1>
      {/* <p className="App-intro">{this.state.apiResponse}</p> */}
    </div>
  );
}
}

export default App;
