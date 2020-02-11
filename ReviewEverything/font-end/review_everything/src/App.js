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
        <Route path='/edit'>
          <Edit/>
        </Route>
        <Route path='/delUsers'>
          <Del/>
        </Route>
      </Switch>
    </Router>

  );
}

export default App;

class Login extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { username: "", password: "", redirect: null };
    this.usernameUpdate = this.usernameUpdate.bind(this);
    this.passcodeUpdate = this.passcodeUpdate.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
    this.redirectToSignUp = this.redirectToSignUp.bind(this);
    // this.addAdmin = this.addAdmin.bind(this);
  }
  
  // addAdmin(event) {
  //   event.preventDefault();

  //   fetch('http://localhost:9000/test/addAdmin', {
  //     method: 'GET',
  //   });
  // }
  
  redirectToSignUp(event) {
    event.preventDefault();

    this.setState({ redirect: '/signup' });
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
          {/* <form onSubmit={this.addAdmin}>
            <input type='submit' value='Add Admin'/>
          </form> */}
      </div>
    );
  }
}

class Edit extends React.Component {

  constructor(props) {
    super(props);
    this.state = { redirect: null, userId: "", username: "", fname: "", lname: "", street: "", city: "", stateVal: "", zip: "", email: "", phone: "", redirect: "" };
    this.changeUName = this.changeUName.bind(this);
    this.changeFName = this.changeFName.bind(this);
    this.changeLName = this.changeLName.bind(this);
    this.changeStreet = this.changeStreet.bind(this);
    this.changeCity = this.changeCity.bind(this);
    this.changeState = this.changeState.bind(this);
    this.changeZip = this.changeZip.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePhone = this.changePhone.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
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

  changePhone(event) {
    this.setState({phone : event.target.value})
  }

  updateInfo(event) {
    event.preventDefault();

    const data = { userId: this.state.userId, username: this.state.username, fname: this.state.fname, lname: this.state.lname, street: this.state.street, city: this.state.city, state: this.state.stateVal, zip_code: this.state.zip, email: this.state.email, phone: this.state.phone };

    console.log(data);

    fetch('http://localhost:9000/test/editAccount', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(json => {
      if (json.error_check === true) {
        console.log(json.message);
        alert(json.message);
      }
      else {
        cookies.set('currentUser', JSON.stringify(json.user), {path: '/'});
        this.setState({redirect: '/home'});
      }
    })
  }
  
  componentDidMount() {
    let currentUser = cookies.get('currentUser');
    this.setState({ userId: currentUser._id, username: currentUser.username, fname: currentUser.fname, lname: currentUser.lname, street: currentUser.street, city: currentUser.city, stateVal: currentUser.state, zip: currentUser.zip_code, email: currentUser.email, phone: currentUser.phone });
  }

  render() {
    if(this.state.redirect) {
      return <Redirect to={ this.state.redirect }/>
    }
    return(
      <div>
        <section>
          <form onSubmit={ this.updateInfo }>
            <label>Username: <input type='text' placeholder='Username here...' value={this.state.username} onChange={ this.changeUName }></input></label><br/>
            <label>First Name: <input type='text' placeholder='First name here...' value={this.state.fname} onChange={ this.changeFName }></input></label><br/>
            <label>Last Name: <input type='text' placeholder='Last name here...' value={this.state.lname} onChange={ this.changeLName }></input></label><br/>
            <label>Street Address: <input type='text' placeholder='Street address here...' value={this.state.street} onChange={ this.changeStreet }></input></label><br/>
            <label>City: <input type='text' placeholder='City here...' value={this.state.city} onChange={ this.changeCity }></input></label><br/>
            <label>State: <select value={this.state.stateVal} onChange={ this.changeState }>
                <option value='AL'>Alabama(AL)</option>
                <option value='AK'>Alaska(AK)</option>
                <option value='AZ'>Arizona(AZ)</option>
                <option value='AR'>Arkansas(AR)</option>
                <option value='CA'>California(CA)</option>
                <option value='CO'>Colorado(CO)</option>
                <option value='CT'>Connecticut(CT)</option>
                <option value='DE'>Delaware(DE)</option>
                <option value='FL'>Florida(FL)</option>
                <option value='GA'>Georgia(GA)</option>
                <option value='HI'>Hawaii(HI)</option>
                <option value='ID'>Idaho(ID)</option>
                <option value='IL'>Illinois(IL)</option>
                <option value='IN'>Indiana(IN)</option>
                <option value='IA'>Iowa(IA)</option>
                <option value='KS'>Kansas(KS)</option>
                <option value='KY'>Kentucky(KY)</option>
                <option value='LA'>Louisiana(LA)</option>
                <option value='ME'>Maine(ME)</option>
                <option value='MD'>Maryland(MD)</option>
                <option value='MA'>Massachusetts(MA)</option>
                <option value='MI'>Michigan(MI)</option>
                <option value='MN'>Minnesota(MN)</option>
                <option value='MS'>Mississippi(MS)</option>
                <option value='MO'>Missouri(MO)</option>
                <option value='MT'>Montana(MT)</option>
                <option value='NE'>Nebraska(NE)</option>
                <option value='NV'>Nevada(NV)</option>
                <option value='NH'>New Hampshire(NH)</option>
                <option value='NJ'>New Jersey(NJ)</option>
                <option value='NM'>New Mexico(NM)</option>
                <option value='NY'>New York(NY)</option>
                <option value='NC'>North Carolina(NC)</option>
                <option value='ND'>North Dakota(ND)</option>
                <option value='OH'>Ohio(OH)</option>
                <option value='OK'>Oklahoma(OK)</option>
                <option value='OR'>Oregon(OR)</option>
                <option value='PA'>Pennsylvania(PA)</option>
                <option value='RI'>Rhode Island(RI)</option>
                <option value='SC'>South Carolina(SC)</option>
                <option value='SD'>South Dakota(SD)</option>
                <option value='TN'>Tennessee(TN)</option>
                <option value='TX'>Texas(TX)</option>
                <option value='UT'>Utah(UT)</option>
                <option value='VT'>Vermont(VT)</option>
                <option value='VA'>Virgina(VA)</option>
                <option value='WA'>Washington(WA)</option>
                <option value='WV'>West Virgina(WV)</option>
                <option value='WI'>Wisconson(WI)</option>
                <option value='WY'>Wyoming(WY)</option>
              </select>
            </label><br/>
            <label>Zipcode: <input type='text' placeholder='Zip here...' value={this.state.zip} onChange={ this.changeZip }></input></label><br/>
            <label>Email: <input type='text' placeholder='Email here...' value={this.state.email} onChange={ this.changeEmail }></input></label><br/>
            <label>Phone Number: <input type='text' placeholder='Phone number here...' value={this.state.phone} onChange={ this.changePhone }></input></label><br/>
            <br/><input type='submit' value='Update Account'/>
          </form>
        </section>
      </div>
    );
  }
}

class Home extends React.Component {

  constructor(props) {
    super(props); 
    this.state = { valueReview: "", admin: false, valueRating: 0, loggedin: true, user: {}, searchTitle: "", searchDescription: "", searchImage: "", search: "", actor: "", searchId: 0, email:"", userId: "", username:"", genre: 28, reviewValue:"", specificR: {} };
    this.submitReview = this.submitReview.bind(this);
    this.changeRating = this.changeRating.bind(this);
    this.changeReview = this.changeReview.bind(this);
    this.changeSearch = this.changeSearch.bind(this);
    this.changeActor = this.changeActor.bind(this); 
    this.changeGenre = this.changeGenre.bind(this); 
    this.getData = this.getData.bind(this);
    this.logout = this.logout.bind(this);
    // this.getReviews = this.getReviews.bind(this);
  }

  changeReview(event) {
    this.setState({valueReview : event.target.value, username: this.state.username, userId: this.state.userId})
  }

  changeRating(event) {
    this.setState({valueRating : event.target.value, username: this.state.username, userId: this.state.userId})
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

    const data = { userId: this.state.user.userId, userfname: this.state.user.fname, userlname: this.state.user.lname, review: this.state.valueReview, rating: this.state.valueRating, movieId: this.state.searchId, email: this.state.email, username: this.state.user.username }
    
    fetch('http://localhost:9000/test/submitReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

  }

  // getReviews(event) {
  //   event.preventDefault();

  //   const data= { RatinguserId: this.state.userId, reviewValue: this.state.rating, ratingValue: this.state.valueRating, movieId: this.state.searchId, Rateusername: this.state.username }
  //   console.log(data.movieId)
  //   this.setState({movieId : data.movieId})
  //   fetch('http://localhost:9000/test/getReviews', {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data),
  //   })
  //   .then(response => response.json())
  //   .then(json => {
  //     if (json.error_check === true) {
  //       console.log(json.message);
  //       alert(json.message);
  //     }
  //   })
  // }

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
            searchM : json.results[0].id,
            username: this.state.username,
            userId: this.state.userId
 });
        
    });
   
  }

  logout() {
    cookies.remove('currentUser');
    this.setState({ loggedin: false })
    if(this.state.loggedin === false){
      this.setState({redirect: "/"})
      return <Redirect to={ this.state.redirect }/>
    }
  }

  editAccount() {
    this.setState({redirect: "/edit"})
  }

  delUsers(){
    this.setState({redirect:"/delUsers"})
  }
  
  componentDidMount() {
    let currentUser = cookies.get('currentUser');
    this.setState({ user: { fname: currentUser.fname, lname: currentUser.lname, userId: currentUser._id, username: currentUser.username, admin: currentUser.admin } });
    console.log(this.state.user.admin)
    this.setState({admin: this.state.user.admin})
  }

  render() {
    if(this.state.redirect) {
      return <Redirect to={ this.state.redirect }/>
    }
    if(this.state.user.admin == true){
      return <div>
      <h1>Home</h1>
        <p>Welcome home {this.state.user.username}!</p>
      <section>
      <h4>Search by Title</h4>
        <form onSubmit={this.getData}>
          <label>Search: </label><input placeholder="Search for Movies" onChange={this.changeSearch} value={this.state.search}></input>
          <h1>{this.state.searchTitle}</h1>
          <img alt="" src={"http://image.tmdb.org/t/p/w185/" + this.state.searchImage}></img>
          <p>{this.state.searchDescription}</p>
          <input type='submit' value='Submit'></input>
        </form>

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
        <h1>{this.state.matchReview}</h1>
      </section>
      <section>
        <button onClick = {() => {
          this.editAccount();
        }}>Edit Account</button>
      </section>
      <button onClick={this.getReviews}>See Reviews</button>
      <button onClick = {() => {
            this.delUsers();
          }}>Admin Feature</button>
      <h1>{this.state.reviewValue}</h1>
    </div>
    }
    return(
      <div>
        <h1>Home</h1>
          <p>Welcome home {this.state.user.username}!</p>
        <section>
        <h4>Search by Title</h4>
          <form onSubmit={this.getData}>
            <label>Search: </label><input placeholder="Search for Movies" onChange={this.changeSearch} value={this.state.search}></input>
            <h1>{this.state.searchTitle}</h1>
            <img alt="" src={"http://image.tmdb.org/t/p/w185/" + this.state.searchImage}></img>
            <p>{this.state.searchDescription}</p>
            <input type='submit' value='Submit'></input>
          </form>

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
          <h1>{this.state.matchReview}</h1>
        </section>
        <section>
          <button onClick = {() => {
            this.editAccount();
          }}>Edit Account</button>
        </section>
        <button onClick={this.getReviews}>See Reviews</button>
        <h1>{this.state.reviewValue}</h1>
      </div>
    );
  }
}

class SignUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = { username: '', fname: '', lname: '', street: '', city: '', stateVal: 'UT', zip: '', email: '', password: '', phone: '', redirect: null };
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
        if (json.error_check === true) {
          console.log(json.message);
          alert(json.message);
        }
        else {
          cookies.set('currentUser', JSON.stringify(json.user), {path: '/'});
          this.setState({redirect: '/home'});
        }
      })
  }
  
  render() {
    if(this.state.redirect) {
      return <Redirect to={ this.state.redirect }/>
    }
    return(
      <div>
        <section>
          <h1>Sign Up</h1>
        </section>
        <section>
          <form onSubmit={ this.submitInfo }>
            <label>Username: <input type='text' placeholder='Username here...' value={this.state.username} onChange={ this.changeUName }></input></label><br/>
            <label>First Name: <input type='text' placeholder='First name here...' value={this.state.fname} onChange={ this.changeFName }></input></label><br/>
            <label>Last Name: <input type='text' placeholder='Last name here...' value={this.state.lname} onChange={ this.changeLName }></input></label><br/>
            <label>Street Address: <input type='text' placeholder='Street address here...' value={this.state.street} onChange={ this.changeStreet }></input></label><br/>
            <label>City: <input type='text' placeholder='City here...' value={this.state.city} onChange={ this.changeCity }></input></label><br/>
            <label>State: <select value={this.state.stateVal} onChange={ this.changeState }>
                <option value='AL'>Alabama(AL)</option>
                <option value='AK'>Alaska(AK)</option>
                <option value='AZ'>Arizona(AZ)</option>
                <option value='AR'>Arkansas(AR)</option>
                <option value='CA'>California(CA)</option>
                <option value='CO'>Colorado(CO)</option>
                <option value='CT'>Connecticut(CT)</option>
                <option value='DE'>Delaware(DE)</option>
                <option value='FL'>Florida(FL)</option>
                <option value='GA'>Georgia(GA)</option>
                <option value='HI'>Hawaii(HI)</option>
                <option value='ID'>Idaho(ID)</option>
                <option value='IL'>Illinois(IL)</option>
                <option value='IN'>Indiana(IN)</option>
                <option value='IA'>Iowa(IA)</option>
                <option value='KS'>Kansas(KS)</option>
                <option value='KY'>Kentucky(KY)</option>
                <option value='LA'>Louisiana(LA)</option>
                <option value='ME'>Maine(ME)</option>
                <option value='MD'>Maryland(MD)</option>
                <option value='MA'>Massachusetts(MA)</option>
                <option value='MI'>Michigan(MI)</option>
                <option value='MN'>Minnesota(MN)</option>
                <option value='MS'>Mississippi(MS)</option>
                <option value='MO'>Missouri(MO)</option>
                <option value='MT'>Montana(MT)</option>
                <option value='NE'>Nebraska(NE)</option>
                <option value='NV'>Nevada(NV)</option>
                <option value='NH'>New Hampshire(NH)</option>
                <option value='NJ'>New Jersey(NJ)</option>
                <option value='NM'>New Mexico(NM)</option>
                <option value='NY'>New York(NY)</option>
                <option value='NC'>North Carolina(NC)</option>
                <option value='ND'>North Dakota(ND)</option>
                <option value='OH'>Ohio(OH)</option>
                <option value='OK'>Oklahoma(OK)</option>
                <option value='OR'>Oregon(OR)</option>
                <option value='PA'>Pennsylvania(PA)</option>
                <option value='RI'>Rhode Island(RI)</option>
                <option value='SC'>South Carolina(SC)</option>
                <option value='SD'>South Dakota(SD)</option>
                <option value='TN'>Tennessee(TN)</option>
                <option value='TX'>Texas(TX)</option>
                <option value='UT'>Utah(UT)</option>
                <option value='VT'>Vermont(VT)</option>
                <option value='VA'>Virgina(VA)</option>
                <option value='WA'>Washington(WA)</option>
                <option value='WV'>West Virgina(WV)</option>
                <option value='WI'>Wisconson(WI)</option>
                <option value='WY'>Wyoming(WY)</option>
              </select>
            </label><br/>
            <label>Zipcode: <input type='text' placeholder='Zip here...' value={this.state.zip} onChange={ this.changeZip }></input></label><br/>
            <label>Email: <input type='text' placeholder='Email here...' value={this.state.email} onChange={ this.changeEmail }></input></label><br/>
            <label>Password: <input type='password' placeholder='Super secret password...' value={this.state.password} onChange={ this.changePassword }></input></label><br/>
            <label>Phone Number: <input type='text' placeholder='Phone number here...' value={this.state.phone} onChange={ this.changePhone }></input></label><br/>
            <br/><input type='submit' value='Sign Up'/>
          </form>
        </section>
      </div>
    )
  }
}

class Del extends React.Component {
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