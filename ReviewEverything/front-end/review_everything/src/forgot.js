import React, {Component} from 'react';
import './App.css';
import { Redirect, useHistory } from 'react-router-dom';
import emailjs from 'emailjs-com';

export default class Forgot extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: null,  temp_params:{"to_name": "hello"} };
        this.resetPassword = this.resetPassword.bind(this); 
        this.sendEmail = this.sendEmail.bind(this);
        this.emailMethod = this.emailMethod.bind(this); 
        // history = useHistory();
    }

    backHome() {
        this.setState({redirect: "/"})
    }

    emailMethod(){
     
        emailjs.init("user_NzA1tUX4PMLx4sM7kfzLy");
     
    }

    sendEmail(event) {
      event.preventDefault();
      console.log("GOT HERE")
      emailjs.sendForm('default_service', 'revieweverythingtemplate', this.temp_params)
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
    }
  

    resetPassword(event){
        event.preventDefault();
        const data = { username: this.state.username}
        console.log(this.usernmae)
        fetch('http://localhost:9000/test/forgot', {
          method: 'GET',
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
          <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/emailjs-com@2.3.2/dist/email.min.js"></script>
          <script type="text/javascript">
             {this.emailMethod}
          </script>
            <h1>Reset Password</h1>
            <form onSubmit={this.sendEmail}>
            <label>Your Email Address: <input type="email"></input></label><br/><br/>
            <button type='submit'>Send</button>
            <button className='back' onClick={() => {
                this.backHome()
              }}>Cancel
            </button>
            </form>
        </div>
    )}
}