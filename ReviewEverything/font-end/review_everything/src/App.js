import React, { Component, useImperativeHandle } from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory, Redirect, Link } from 'react-router-dom';
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
      </Switch>
    </Router>

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
    this.state = { apiResponse: "", valueReview: "", valueRating: 0, email: "", pasword: "", movieId: 0, userId: "", username: ""};
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
    
   
    // fetch("http://localhost:9000/test", {
    //   method: 'GET'
    // })
    //   .then(response => response.text())
    //   .then(text => {
    //     // console.log(text);
    //     console.log(data)
    //     this.setState({ apiResponse: text });
    //   })


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
          {/* <form onSubmit={this.hashPasswords}>
           <input type='submit' value='Hash Passwords'/>
         </form> */}
      </div>
    );
  }
}

// export default Login;

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
          <p>Welcome home user!</p>
          <p>Welcome home {this.state.user.fname}!</p>
        <section>
        <h4>Search by Title</h4>
          <form onSubmit={this.getData}>
            <label>Search</label><input placeholder="Search for Movies" onChange={this.changeSearch} value={this.state.search}></input>
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
            />
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

// export default Home;
