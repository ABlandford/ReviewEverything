import React, {Component} from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Review = ({ username, rating, review, movieTitle }) => {
    return (
        <section>
            <h3>Title of Reviewed Movie: { movieTitle }</h3>
            <p>Rating: { rating }/5</p>
            <p>Review: "{ review }"</p>
        </section>
    )
}

export default class UReviews extends Component {

    constructor(props) {
        super(props);
        this.state = { redirect: '', user: {}, reviews: [] };
        this.goHome = this.goHome.bind(this);
    }

    goHome() {
        this.setState({ redirect: '/home' })
    }
    
    componentDidMount() {
        if(!cookies.get('currentUser')) {
            this.setState({ redirect: '/' });
        } else {
            let currentUser = cookies.get('currentUser');
            const data = { username: currentUser.username };
        
            fetch('http://localhost:9000/test/getReviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(json => {
                console.log(json);
                this.setState({ reviews: json });
            })
        }
    }
    
    render() {
        let reviews_container = [];
        for(let i = 0; i < this.state.reviews.length; i++) {
            reviews_container.push(
                <Review
                    key = { i }
                    username = { this.state.reviews[i].username }
                    rating = { this.state.reviews[i].rating }
                    review = { this.state.reviews[i].review }
                    movieTitle = { this.state.reviews[i].movieTitle }
                />
            )
        }
            
        if(this.state.redirect) {
            return <Redirect to={ this.state.redirect }/>
        }
        return(
            <div className='review-display'>
                <h1>Hello. This be the user reviews page.</h1><br/>
                <div>
                    { reviews_container }
                </div>
                <button onClick={() => {
                    this.goHome();
                }}>Home</button>
            </div>
        )
    }
}