import React, {Component} from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Rating from 'react-rating';
import star from './images/fullstar.png';
import empty from './images/transparent_star.png';

const cookies = new Cookies();

export default class ReviewEdit extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: '', userReview: '', userRating: '', movieReviewed: '', reviewId: '' }
        this.toReviews = this.toReviews.bind(this);
        this.updateReview = this.updateReview.bind(this);
        this.saveReview = this.saveReview.bind(this);
    }

    saveReview(event) {
        event.preventDefault();
        
        if(!this.state.userReview || !this.state.userRating) {
            alert('Some fields seem to be empty. Please make sure you are submitting a new review and rating or keeping an old field.');
        } else {
            const data = { newReview: this.state.userReview, newRating: this.state.userRating, reviewId: this.state.reviewId  }
    
            fetch('http://localhost:9000/test/editReview', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(json => {
                if(json.success === true) {
                    cookies.remove('userRating');
                    cookies.remove('userReview');
                    cookies.remove('reviewMovie');
                    this.setState({ redirect: '/userReviews' });
                }
            })
        }
    }
    
    onStarClick(nextValue, prevValue, name) {
        this.setState({ userRating: nextValue });
    }
    
    updateReview(event) {
        this.setState({ userReview: event.target.value });
    }
    
    toReviews() {
        cookies.remove('userRating');
        cookies.remove('userReview');
        cookies.remove('reviewMovie');
        this.setState({ redirect: '/userReviews' });
    }
    
    componentDidMount() {
        if(!cookies.get('currentUser')) {
            this.setState({ redirect: '/' });
        }
        else if(!cookies.get('userReview') || !cookies.get('userRating') || !cookies.get('reviewMovie')) {
            this.setState({ redirect: '/home' });
        } else {
            let review = cookies.get('userReview');
            let rating = cookies.get('userRating');
            let title = cookies.get('reviewMovie');
            let reviewId = cookies.get('reviewId');
            this.setState({ userReview: review, userRating: rating, movieReviewed: title, reviewId: reviewId });
        }
    }
    
    render() {
        if(this.state.redirect) {
            return <Redirect to={ this.state.redirect }/>
        }
        return(
            <div>
                <div>
                    <p>The movie you reviewed: { this.state.movieReviewed }</p>
                </div>
                <form onSubmit={ this.saveReview }>
                    <Rating initialRating={this.state.userRating} name="valueRating" onClick={ (rating) => this.setState({userRating: rating})} fullSymbol={<img src={star} style={{height: 50, width: 50}} className='fullstar' alt='filled star' />} emptySymbol={<img src={empty} style={{height: 50, width: 50}} className='halfstar' alt='filled star' />} fractions={2}/><br/>
                    <label>Your Review: <input type='text' value={ this.state.userReview } onChange={ this.updateReview }></input></label><br/>
                    <input type='submit' value='Save Review'/>
                </form>
                <section>
                    <button onClick={() => {
                        this.toReviews();
                    }}>Your Reviews</button>
                </section>
            </div>
        )
    }
}