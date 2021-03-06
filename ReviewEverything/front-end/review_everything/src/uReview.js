import React, {Component} from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class UReviews extends Component {

    constructor(props) {
        super(props);
        this.state = { redirect: '', user: {}, reviews: [] };
        this.goHome = this.goHome.bind(this);
        this.toEdit = this.toEdit.bind(this);
        this.deleteReview = this.deleteReview.bind(this);
    }

    deleteReview(rId) {
        const data = { reviewId: rId }

        fetch('http://localhost:9000/test/deleteReview', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(json => {
            console.log(json.message);
            window.location.reload(false);
        })
    }
    
    toEdit(uRating, uReview, mReview, reviewId) {
        cookies.set('userReview', JSON.stringify(uReview), { path: '/' });
        cookies.set('userRating', JSON.stringify(uRating), { path: '/' });
        cookies.set('reviewMovie', JSON.stringify(mReview), { path: '/' });
        cookies.set('reviewId', JSON.stringify(reviewId), { path: '/' });
        this.setState({ redirect: '/editReview' });
    }

    goHome() {
        this.setState({ redirect: '/home' })
    }
    
    componentDidMount() {
        if(!cookies.get('currentUser')) {
            this.setState({ redirect: '/' });
        } else {
            let currentUser = cookies.get('currentUser');
            this.setState({ user: { username: currentUser.username } })
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
                <section className='full-review'>
                    <h3 className='view-review-title'>Title of Reviewed Movie: { this.state.reviews[i].movieTitle }</h3>
                    <section className='rating-holder'>
                        <p className='view-rating-label'>Rating: <br/><br/><p className='view-rating'>{ this.state.reviews[i].rating }/5</p></p>
                    </section>
                    <section className='review-holder'>
                        <p className='view-review-label'>Review: <br/><br/><p className='view-review'>"{ this.state.reviews[i].review }"</p></p>
                    </section>
                    <section>
                        <button className='edit-review-btn' onClick={() => {
                            this.toEdit(this.state.reviews[i].rating, this.state.reviews[i].review, this.state.reviews[i].movieTitle, this.state.reviews[i]._id)
                        }}>Edit Review</button>
                        <button className='delete-review-btn' onClick={() => {
                            this.deleteReview(this.state.reviews[i]._id)
                        }}>Delete Review</button>
                    </section>
                </section>
            )
        }
            
        if(this.state.redirect) {
            return <Redirect to={ this.state.redirect }/>
        }
        return(
            <div className='review-display'>
                <div className='user-review-header'>
                    <h1>Hello { this.state.user.username }! Here are your reviews </h1><br/>
                </div>
                <div>
                    { reviews_container }
                </div>
                <div className='edit-nav'>
                    <button className='home-link' onClick={() => {
                        this.goHome();
                    }}>Home</button>
                </div>
            </div>
        )
    }
}