import React, { Component, useImperativeHandle } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const App = () => {
  
  // constructor(props) {
  //   super(props);
  //   this.state = { apiResponse: "" };
  //   // this.hashPasswords = this.hashPasswords.bind(this);
  // }
  
  // callAPI() {
  //   fetch("http://localhost:9000/test", {
  //     method: 'GET'
  //   })
  //     .then(response => response.text())
  //     .then(text => {
  //       console.log(text);
  //       this.setState({ apiResponse: text });
  //     })
  // }
  
  // componentWillMount() {
  //   this.callAPI();
  // }  
  
  // hashPasswords(event) {
  //   event.preventDefault();
    
  //   fetch('http://localhost:9000/test/hash', {
  //     method: 'GET',
  //   })
  //     .then(response => response.text())
  //     .then(text => {
  //       console.log(text);
  //     })
  // }

  return (
    // <div className="App">
    //   <header className="App-header">
    <Router>
      <Switch>
        <Route exact path='/'>
          <Login/>
        </Route>
        <Route path='/home'>
          <Home/>
        </Route>
        <Route path='/signup'>
          <SignUp/>
        </Route>
      </Switch>
    </Router>
        
      //   <form onSubmit={this.hashPasswords}>
      //     <input type='submit' value='Hash Passwords'/>
      //   </form>
      // </header>
      // <p className="App-intro">{this.state.apiResponse}</p>
    // </div>
  );
}

export default App;

class Login extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { email: "", pasword: "", redirect: null };
    this.emailUpdate = this.emailUpdate.bind(this);
    this.passcodeUpdate = this.passcodeUpdate.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
    this.redirectToSignUp = this.redirectToSignUp.bind(this);
  }
  
  redirectToSignUp(event) {
    event.preventDefault();

    this.setState({ redirect: '/signup' });
  }
  
  emailUpdate(event) {
    this.setState({email : event.target.value})
  }
  
  passcodeUpdate(event) {
    this.setState({password : event.target.value})
  }
  
  checkLogin(event) {
    event.preventDefault();

    const data = { email: this.state.email, password: this.state.password }
    
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
          <section>
            <form onSubmit={ this.redirectToSignUp }>
              <input type='submit' value='Sign Up'></input>
            </form>
          </section>
      </div>
    );
  }
}

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
    
    fetch('http://localhost:9000/test/submitReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
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

class SignUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = { fname: '', lname: '', street: '', city: '', stateVal: '', zip: '', email: '', password: '', phone: '', redirect: '' };
    this.changeFName = this.changeFName.bind(this);
    this.changeLName = this.changeLName.bind(this);
    this.changeStreet = this.changeStreet.bind(this);
    this.changeCity = this.changeCity.bind(this);
    this.changeState = this.changeState.bind(this);
    this.changeZip = this.changeZip.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changePhone = this.changePhone.bind(this);
    this.submitInfo = this.submitInfo.bind(this);
  }
  
  changeFName(event) {
    this.setState({fname : event.target.value})
  }

  changeLName(event) {
    this.setState({lname : event.target.value})
  }

  changeStreet(event) {
    this.setState({street : event.target.value})
  }

  changeCity(event) {
    this.setState({city : event.target.value})
  }

  changeState(event) {
    this.setState({stateVal : event.target.value})
  }

  changeZip(event) {
    this.setState({zip : event.target.value})
  }

  changeEmail(event) {
    this.setState({email : event.target.value})
  }

  changePassword(event) {
    this.setState({password : event.target.value})
  }

  changePhone(event) {
    this.setState({phone : event.target.value})
  }
  
  submitInfo(event) {
    event.preventDefault();

    const data = { fname: this.state.fname, lname: this.state.lname, street: this.state.street, city: this.state.city, state: this.state.stateVal, zip_code: this.state.zip, email: this.state.email, password: this.state.password, phone: this.state.phone };
  
    fetch('http://localhost:9000/test/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        cookies.set('currentUser', JSON.stringify(json.newUser), {path: '/'})
        this.setState({redirect: '/home'})
      })
  }
  
  render() {
    if(this.state.redirect) {
      return <Redirect to={ this.state.redirect }/>
    }
    return(
      <div>
        <form onSubmit={ this.submitInfo }>
          <label>First Name: <input type='text' value={this.state.fname} onChange={ this.changeFName }></input></label><br/>
          <label>Last Name: <input type='text' value={this.state.lname} onChange={ this.changeLName }></input></label><br/>
          <label>Street Address: <input type='text' value={this.state.street} onChange={ this.changeStreet }></input></label><br/>
          <label>City: <input type='text' value={this.state.city} onChange={ this.changeCity }></input></label><br/>
          <label>State: <input type='text' value={this.state.stateVal} onChange={ this.changeState }></input></label><br/>
          <label>Zipcode: <input type='text' value={this.state.zip} onChange={ this.changeZip }></input></label><br/>
          <label>Email: <input type='text' value={this.state.email} onChange={ this.changeEmail }></input></label><br/>
          <label>Password: <input type='text' value={this.state.password} onChange={ this.changePassword }></input></label><br/>
          <label>Phone Number: <input type='text' value={this.state.phone} onChange={ this.changePhone }></input></label><br/>
          <input type='submit' value='Sign Up'/>
        </form>
      </div>
    )
  }
}