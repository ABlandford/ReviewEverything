import React, {Component} from 'react';
import './App.css';
import { Redirect, useHistory } from 'react-router-dom';
import emailjs from 'emailjs-com';

export default class Forgot extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: null,  temp_params: "", name: "" };
        this.sendEmail = this.sendEmail.bind(this);
        this.emailMethod = this.emailMethod.bind(this); 
        // history = useHistory();
        this.addLocked = this.addLocked.bind(this); 
        this.setEmail = this.setEmail.bind(this); 
    }

  addLocked(event) {
    event.preventDefault();

    fetch('http://localhost:9000/test/locked', {
      method: 'GET',
    });
  }

    backHome() {
        this.setState({redirect: "/"})
    }

    emailMethod(){
     
        emailjs.init("user_NzA1tUX4PMLx4sM7kfzLy");
     
    }

    setEmail(event){
      this.setState({temp_params: event.target.value})
    }
  

   sendEmail(event){
     event.preventDefault(); 
     const data = { email: this.state.temp_params };
     fetch('http://localhost:9000/test/changePassword', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify(data),
         }) 
         .then(response => response.json())
             .then(json => {
                 console.log(json.userLog+" #####");
                 this.setState({name: json.userLog})
                 console.log(this.state.name)
                 
             })
    console.log(this.state.temp_params+"!!!")
    emailjs.send("gmail", "revieweverythingtemplate", {"email":this.state.temp_params})
    .then(function(response) {
       console.log('SUCCESS!', response.status, response.text);
    }, function(err) {
       console.log('FAILED...', err);
    });

  }
 
    render() {

      if(this.state.redirect) { 
        return <Redirect to={ this.state.redirect }/> 
      }

      return(
        <div>
          <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
          <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/emailjs-com@2.3.2/dist/email.min.js"></script>
          <script type="text/javascript">
             {this.emailMethod()}
          </script>
            <h1>Reset Password</h1>
            <form onSubmit={this.sendEmail}>
            <label>Your Email Address: <input type="email" onChange={this.setEmail}></input></label><br/><br/>
            <button type='submit'>Send</button>
            <button className='back' onClick={() => {
                this.backHome()
              }}>Cancel
            </button>
            </form>
        </div>
    )}
}