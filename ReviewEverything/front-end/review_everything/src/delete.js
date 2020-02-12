import React, {Component} from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';

export default class Del extends Component {
  constructor(props) {
    super(props);
    this.state = { redirect: null, username: ''};
    this.delUser = this.delUser.bind(this)
    this.changeId = this.changeId.bind(this)
  }

  changeId(event) {
    this.setState({username : event.target.value})
  }
  
  delUser(event){
    event.preventDefault();
    const data = { username: this.state.username}
    console.log(data.username)
    fetch('http://localhost:9000/test/delUsers', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }) 
    
}
  render() {
    if(this.state.redirect) {
      return <Redirect to={ this.state.redirect }/>
    }
    return(
      <div>
        <h3>Which user would you want to delete?</h3>
        <form onSubmit={ this.delUser }>
        <label>Input User's Username  </label><input type='text'  placeholder='Delete Account' value={this.state.username} onChange={this.changeId}></input>
        <br></br><br/><input type='submit'/>
        </form>
      </div>
    )
  }
}