import React, {Component} from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
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
    // this.getReviews = this.getReviews.bind(this);
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

    if(!this.state.valueReview || !this.state.searchId) {
      alert('Some data fields appear to not have any information. Did you make sure to search a movie and then type in your review?')
    } else {
      const data = { userId: this.state.user.userId, review: this.state.valueReview, rating: this.state.valueRating, movieId: this.state.searchId, username: this.state.user.username }
      fetch('http://localhost:9000/test/submitReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    }
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
            searchM : json.results[0].id,
            username: this.state.username,
            userId: this.state.userId
      });        
    });   
  }

  logout() {
    cookies.remove('currentUser');
    this.setState({ loggedin: false })
    this.setState({redirect: "/"})
  }

  editAccount() {
    this.setState({redirect: "/edit"})
  }

  delUsers(){
    this.setState({redirect:"/delUsers"})
  }
  
  componentDidMount() {
    if(!cookies.get('currentUser')) {
      this.setState({ redirect: '/' })
    } else {
      let currentUser = cookies.get('currentUser');
      this.setState({ user: { fname: currentUser.fname, lname: currentUser.lname, userId: currentUser._id, username: currentUser.username, admin: currentUser.admin } });
      this.setState({admin: this.state.user.admin})
    }
  }

  render() {
    if(this.state.redirect) {
      return <Redirect to={ this.state.redirect }/>
    }
    if(this.state.user.admin === true) {
      return( 
        <div className='home-display'>
          <div className='welcome'>
            <section className='welcome-message'>
              <p>Welcome {this.state.user.username}!</p>
            </section>
            <section className='logout-container'>
              <button className='logout-link' onClick = {() => {
                this.logout();
              }}>Logout</button>
            </section>
          </div>
          <nav className='home-nav'>
            <button className='nav-link' onClick = {() => {
              this.editAccount();
            }}>Edit Account</button>
            {/* <button className='nav-link' onClick={() => {
              this.getReviews();
            }}>See Reviews</button> */}
            <button className='nav-link' onClick = {() => {
              this.delUsers();
            }}>Delete a User</button>
          </nav>
          <div className='body-container'>
            <div className='body-title'>
              <h4>Search by Title</h4>
            </div>
            <form onSubmit={this.getData} id='reviewSub'>
              <label className='search-label'>Search: <input className='title-search' placeholder="Enter movie title" onChange={this.changeSearch} value={this.state.search}></input></label>
              <h1 className='result-title'>{this.state.searchTitle}</h1>
              <img className='result-image' alt="" src={"http://image.tmdb.org/t/p/w185/" + this.state.searchImage}></img>
              <p className='result-description'>{this.state.searchDescription}</p>
              <input className='submit-search' type='submit' value='Search for Movie'></input>
            </form>
            <form onSubmit={this.submitReview} id='reviewForm'>
              <section className='review-label'>
                <label>What do think of movie?</label><br/>
              </section>
              <input className='review-text' placeholder='Please type your review of the movie' type='text' value={this.state.valueReview} onChange={this.changeReview}/><br/>
              <section className='rating-container'>
                <Rating initialRating={this.state.valueRating} name="valueRating" onClick={ (rating) => this.setState({valueRating: rating})} fullSymbol={<img src={star} style={{height: 50, width: 50}} className='fullstar' alt='filled star' />} emptySymbol={<img src={empty} style={{height: 50, width: 50}} className='halfstar' alt='filled star' />} fractions={2}/><br/>
              </section>
              <input className='submit-review-btn' type='submit' value='Submit Your Review'></input>
            </form>
          </div>
          <h1>{this.state.reviewValue}</h1>
        </div>
      );
    } else {
      return(
        <div className='home-display'>
          <div className='welcome'>
            <section className='welcome-message'>
              <p>Welcome {this.state.user.username}!</p>
            </section>
            <section className='logout-container'>
              <button className='logout-link' onClick = {() => {
                this.logout();
              }}>Logout</button>
            </section>
          </div>
          <nav className='home-nav'>
            <button className='nav-link' onClick = {() => {
              this.editAccount();
            }}>Edit Account</button>
            {/* <button className='nav-link' onClick={() => {
              this.getReviews();
            }}>See Reviews</button> */}
          </nav>
          <div className='body-container'>
            <div className='body-title'>
              <h4>Search by Title</h4>
            </div>
            <form onSubmit={this.getData}>
              <label className='search-label'>Search: <input className='title-search' placeholder="Enter movie title" onChange={this.changeSearch} value={this.state.search}></input></label>
              <h1 className='result-title'>{this.state.searchTitle}</h1>
              <img className='result-image' alt="" src={"http://image.tmdb.org/t/p/w185/" + this.state.searchImage}></img>
              <p className='result-description'>{this.state.searchDescription}</p>
              <input className='submit-search' type='submit' value='Search for Movie'></input>
            </form>
            <form onSubmit={this.submitReview}>
              <section className='review-label'>
                <label>What do think of movie?</label><br/>
              </section>
              <input className='review-text' placeholder='Please type your review of the movie you searched here' type='text' value={this.state.valueReview} onChange={this.changeReview}/><br/>
              <section className='rating-container'>
                <Rating initialRating={this.state.valueRating} name="valueRating" onClick={ (rating) => this.setState({valueRating: rating})} fullSymbol={<img src={star} style={{height: 50, width: 50}} className='fullstar' alt='filled star' />} emptySymbol={<img src={empty} style={{height: 50, width: 50}} className='halfstar' alt='filled star' />} fractions={2}/><br/>
              </section>
              <input className='submit-review-btn' type='submit' value='Submit Your Review'></input>
            </form>
          </div>
  
          <h1>{this.state.reviewValue}</h1>
        </div>
      );
    }
  }
}