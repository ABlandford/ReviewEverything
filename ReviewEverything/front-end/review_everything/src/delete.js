import React, {Component} from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class Del extends Component {
  constructor(props) {
    super(props);
    this.state = { redirect: null, username: ''};
    this.delUser = this.delUser.bind(this);
    this.changeId = this.changeId.bind(this);
    this.goHome = this.goHome.bind(this);
  }

  goHome() {
    this.setState({ redirect: '/home' });
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

  componentDidMount() {
    if(!cookies.get('currentUser')) {
      this.setState({ redirect: '/' });
    } else {
      let currentUser = cookies.get('currentUser');
      if(currentUser.admin === false || !currentUser) {
        this.setState({ redirect: '/home' });
      } else {
        console.log('Admin confirmed.');
      }
    }
  }
  
  render() {
    if(this.state.redirect) {
      return <Redirect to={ this.state.redirect }/>
    }
    return(
      <div className='delete-display'>
        <div className='delete-header'>
          <h3>Who has been naughty?</h3>
        </div>
        <div className='delete-form'>
          <form onSubmit={ this.delUser } className='t'>
          <input className='delete-input' type='text'  placeholder='Input Username of User to Delete' value={this.state.username} onChange={this.changeId}></input>
          <br/><input className='delete-submit' type='submit' value='Delete User'/>
          </form>
          <div className='d-link-container'>
            <button className='delete-link' onClick={() => {
              this.goHome();
            }}>Home</button>
          </div>
        </div>
      </div>
    )
  }
}