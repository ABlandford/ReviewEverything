import React, {Component} from 'react';
import './App.css';

export default class movies extends Component{

    getData = event => {
        event.preventDefault(); 
        let url = `https://api.themoviedb.org/3/search/movie?api_key=c4bf14506f6431c453952fcfa9057242&query=Jack+Reacher`;
        
        
        fetch(url, {
            
            method: 'GET',
        })
        
        .then(response => response.json())
        .then(json => {
            this.setState ( {
                
                ans: json.results,
                       
            });
            
        });
        console.log(this.state.ans);
    }

    render(){
    
        return (
            <form onSubmit={this.getData}>
            <h1>HELLO</h1>
            </form>
        )}
}