import React, { Component, useImperativeHandle } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';
import './App.css';
import Cookies from 'universal-cookie'

const cookies = new Cookies();

const App = () => {
  return (
 
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

  );
}

export default App;

class Login extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { username: "", pasword: "", redirect: null };
    this.usernameUpdate = this.usernameUpdate.bind(this);
    this.passcodeUpdate = this.passcodeUpdate.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
    this.redirectToSignUp = this.redirectToSignUp.bind(this);
    this.editUsernames = this.editUsernames.bind(this);
  }
  
  editUsernames(event) {
    event.preventDefault();

    fetch('http://localhost:9000/test/addusername', {
      method: 'GET',
    });
  }
  
  redirectToSignUp(event) {
    event.preventDefault();

    this.setState({ redirect: '/signup' });
    this.state = { apiResponse: "", valueReview: "", valueRating: 0, email: "", pasword: "", movieId: 0, userId: "", username: ""};
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
      <div>
        <h1>Sign In</h1>
          <form onSubmit={this.checkLogin}>
            <label>Username: </label><input type='text' value={this.state.username} onChange={this.usernameUpdate}></input><br/>
            <label>Password: </label><input type='password' value={this.state.password} onChange={this.passcodeUpdate}></input><br/>
            <input type='submit' value='Log In'></input>
          </form>
          <section>
            <form onSubmit={ this.redirectToSignUp }>
              <input type='submit' value='Sign Up'></input>
            </form>
          </section>
          <form onSubmit={this.editUsernames}>
            <input type='submit' value='Edit Usernames'/>
          </form>
      </div>
    );
  }
}

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = { valueReview: "", valueRating: 0, loggedin: true, user: {}, searchTitle: "", searchDescription: "", searchImage: "", search: "", actor: "", searchId: 0, email:"", userId: "", username:"", genre: 28, };
    this.submitReview = this.submitReview.bind(this);
    this.changeRating = this.changeRating.bind(this);
    this.changeReview = this.changeReview.bind(this);
    this.changeSearch = this.changeSearch.bind(this);
    this.changeActor = this.changeActor.bind(this); 
    this.changeGenre = this.changeGenre.bind(this); 
    this.getData = this.getData.bind(this);
    this.logout = this.logout.bind(this);
  }

  changeReview(event) {
    this.setState({valueReview : event.target.value, username: this.state.email, userId: this.state.userId})
  }

  changeRating(event) {
    this.setState({valueRating : event.target.value, username: this.state.email, userId: this.state.userId})
  }
  
  changeSearch(event) {
    this.setState({search : event.target.value})
  }

    
  changeActor(event) {
    this.setState({actor : event.target.value})
  }

  changeGenre(event) {
    this.setState({genre : event.target.value})
    console.log(this.state.genre)
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({valueRating: nextValue});
  }
  
  submitReview(event) {
    event.preventDefault();

    const data = { userId: this.state.user.userId, userfname: this.state.user.fname, userlname: this.state.user.lname, review: this.state.valueReview, rating: this.state.valueRating, movieId: this.state.searchId, email: this.state.email, username: this.state.user.email }
    
    fetch('http://localhost:9000/test/submitReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

  }

  getData(event){
    event.preventDefault(); 
  
    let url = `https://api.themoviedb.org/3/search/movie?api_key=c4bf14506f6431c453952fcfa9057242&query=${this.state.search}&with_genres=${this.state.genre}`;

    fetch(url, {
        method: 'GET'
    })

    .then(response => response.json())
    .then(json => {
        this.setState ( {
            searchTitle: json.results[0].title,
            searchDescription: json.results[0].overview, 
            searchImage: json.results[0].poster_path, 
            searchId: json.results[0].id, 
            username: this.state.email,
            userId: this.state.userId
 });
        
    });
    console.log(this.state.search+"*****")
  }

 
  getDataActor(event){
    event.preventDefault(); 
  
    let url = `https://api.themoviedb.org/3/search/person?api_key=c4bf14506f6431c453952fcfa9057242&query=${this.state.actor}`;

    fetch(url, {
        method: 'GET'
    })

    .then(response => response.json())
    .then(json => {
        this.setState ( {
            searchTitle: json.results[0].title,
            searchDescription: json.results[0].overview, 
            searchImage: json.results[0].poster_path, 
            searchId: json.results[0].id, 
            username: this.state.email,
            userId: this.state.userId, 
 });
        
    });
    console.log(this.state.actor+"*****")
  }

  logout() {
    cookies.remove('currentUser');
    this.setState({ loggedin: false })
    if(this.state.loggedin == false){
      this.setState({redirect: "/"})
      return <Redirect to={ this.state.redirect }/>
    }
  }

  componentDidMount() {
    let currentUser = cookies.get('currentUser');
    this.setState({ user: { fname: currentUser.fname, lname: currentUser.lname, userId: currentUser._id } });
  }

  render() {
    return(
      <div>
        <h1>Home</h1>
          <p>Welcome home {this.state.user.fname}!</p>
        <section>
        <h4>Search by Title</h4>
          <form onSubmit={this.getData}>
            <label>Search: </label><input placeholder="Search for Movies" onChange={this.changeSearch} value={this.state.search}></input>
            <h1>{this.state.searchTitle}</h1>
            <img src={"http://image.tmdb.org/t/p/w185/" + this.state.searchImage}></img>
            <p>{this.state.searchDescription}</p>
            <input type='submit' value='Submit'></input>
          <renderReviews/>
          </form>
{/* 
          <h4>Search by Actor</h4>
          <form onSubmit={this.getDataActor}>
            <label>Search</label><input placeholder="Search for Movies" onChange={this.changeActor} value={this.state.actor}></input>
            <input type='submit' value='Submit'></input>
          </form>

        <h4>Search by Genre</h4>
        <form onSubmit={this.getData} >
          <select 
              class="dropDown"
              value={this.state.genre}
              onChange={this.changeGenre} 
              ><option value={27}>Horror</option>
              <option value={10749}>Romance</option>
              <option value={35}>Action</option>
          </select>
          <input type='submit' value='Submit'></input>
        </form> */}

            <form onSubmit={this.submitReview}>
              <label>What do think of movie? </label><input type='text' value={this.state.valueReview} onChange={this.changeReview}></input><br/>
            <StarRatingComponent 
                  name="starSystem" 
                  id="stars"
                  value={this.state.valueRating}
                  starCount={5}
                  onStarClick={this.onStarClick.bind(this)}
                  onChange = {this.changeRating}
            /><br/>
            <input type='submit' value='Submit'></input>
            </form>
        </section>
        <section>
        <Link to={'/'}>
          <button onClick = {() => {
            this.logout();
          }}>Logout</button>
          </Link>
        </section>
      </div>
    );
  }
}

class SignUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = { username: '', fname: '', lname: '', street: '', city: '', stateVal: '', zip: '', email: '', password: '', phone: '', redirect: '' };
    this.changeUName = this.changeUName.bind(this);
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
  
  changeUName(event) {
    this.setState({username : event.target.value})
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

    const data = { username: this.state.username, fname: this.state.fname, lname: this.state.lname, street: this.state.street, city: this.state.city, state: this.state.stateVal, zip_code: this.state.zip, email: this.state.email, password: this.state.password, phone: this.state.phone };
  
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
        cookies.set('currentUser', JSON.stringify(json), {path: '/'})
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
          <label>Username: <input type='text' value={this.state.username} onChange={ this.changeUName }></input></label><br/>
          <label>First Name: <input type='text' value={this.state.fname} onChange={ this.changeFName }></input></label><br/>
          <label>Last Name: <input type='text' value={this.state.lname} onChange={ this.changeLName }></input></label><br/>
          <label>Street Address: <input type='text' value={this.state.street} onChange={ this.changeStreet }></input></label><br/>
          <label>City: <input type='text' value={this.state.city} onChange={ this.changeCity }></input></label><br/>
          <label>State: <input type='text' value={this.state.stateVal} onChange={ this.changeState }></input></label><br/>
          <label>Zipcode: <input type='text' value={this.state.zip} onChange={ this.changeZip }></input></label><br/>
          <label>Email: <input type='text' value={this.state.email} onChange={ this.changeEmail }></input></label><br/>
          <label>Password: <input type='password' value={this.state.password} onChange={ this.changePassword }></input></label><br/>
          <label>Phone Number: <input type='text' value={this.state.phone} onChange={ this.changePhone }></input></label><br/>
          <input type='submit' value='Sign Up'/>
        </form>
      </div>
    )
  }
}
