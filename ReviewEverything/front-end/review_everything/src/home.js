import React, {Component} from 'react';
import './App.css';
import { Redirect, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Rating from 'react-rating';
import star from './images/fullstar.png';
import empty from './images/transparent_star.png';

const cookies = new Cookies();

export default class Home extends Component {

  constructor(props) {
    super(props); 
    this.state = { valueReview: "", admin: false, valueRating: 0, loggedin: true, user: {}, searchTitle: "", searchDescription: "", searchImage: "", search: "", actor: "", searchId: 0, email:"", userId: "", username:"", genre: 28, reviewValue:"", specificR: {} };
    this.submitReview = this.submitReview.bind(this);
    this.changeReview = this.changeReview.bind(this);
    this.changeSearch = this.changeSearch.bind(this);
    this.changeActor = this.changeActor.bind(this); 
    this.changeGenre = this.changeGenre.bind(this); 
    this.getData = this.getData.bind(this);
    this.logout = this.logout.bind(this);
  }

  changeReview(event) {
    this.setState({valueReview : event.target.value, username: this.state.username, userId: this.state.userId})
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
    if(this.state.user.admin === true){
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
            <Rating initialRating={this.state.valueRating} name="valueRating" onClick={ (rating) => this.setState({valueRating: rating})} fullSymbol={<img src={star} style={{height: 50, width: 50}} className='fullstar' alt='filled star' />} emptySymbol={<img src={empty} style={{height: 50, width: 50}} className='halfstar' alt='filled star' />} fractions={2}/><br/>
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
              <Rating initialRating={this.state.valueRating} name="valueRating" onClick={ (rating) => this.setState({valueRating: rating})} fullSymbol={<img src={star} style={{height: 50, width: 50}} className='fullstar' alt='filled star' />} emptySymbol={<img src={empty} style={{height: 50, width: 50}} className='halfstar' alt='filled star' />} fractions={2}/><br/>
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