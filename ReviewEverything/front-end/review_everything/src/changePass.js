import React, { Component } from "react";
import "./App.css";
import emailjs from "emailjs-com";
import { Redirect, useHistory } from "react-router-dom";

export default class changePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      name: "",
      hashedUser: "",
      email: "",
      input: "",
      newpass: ""
    };
    this.sendPass = this.sendPass.bind(this);
    this.setHash = this.setHash.bind(this);
    this.emailMethod = this.emailMethod.bind(this);
    this.changer = this.changer.bind(this);
    this.setInput = this.setInput.bind(this);
    this.setnewPass = this.setnewPass.bind(this);
  }

  backHome() {
    this.setState({ redirect: "/" });
  }

  emailMethod() {
    emailjs.init("user_NzA1tUX4PMLx4sM7kfzLy");
  }

  setInput(event) {
    event.preventDefault();
    console.log(event.target.value + " !!!!");
    this.setState({ input: event.target.value });
  }

  setHash(event) {
    event.preventDefault();
    console.log(event.target.value);
    this.setState({ email: event.target.value });
  }

  setnewPass(event) {
    event.preventDefault();
    console.log(event.target.value);
    this.setState({ newpass: event.target.value });
  }

  changer(event) {
    event.preventDefault();
    const data = { email: this.state.email };
    fetch("http://localhost:9000/test/hashedUsername", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(json => {
        console.log(json.hashuser + " #####");
        this.setState({ hashedUser: json.hashuser });
        console.log(this.state.hashedUser);
        emailjs
          .send("gmail", "template_7UrREfLB", {
            hashedPass: this.state.hashedUser,
            email: this.state.email
          })
          .then(
            function(response) {
              console.log("SUCCESS!", response.status, response.text);
            },
            function(err) {
              console.log("FAILED...", err);
            }
          );
      });
  }

  sendPass(event) {
    event.preventDefault();
    console.log("Input " + this.state.input);
    console.log("Hashed " + this.state.hashedUser);
    if (this.state.input === this.state.hashedUser) {
      const data = { email: this.state.email, input: this.state.input, newpass: this.state.newpass };
      fetch("http://localhost:9000/test/setPass", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(json => {
          console.log(json.locked);
        });
    } else {
      alert("Code isn't correct try again");
    }
  }

  render() {
    return (
      <div className="login-display">
      <div className="login-form">
        <script
          type="text/javascript"
          src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"
        ></script>
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/npm/emailjs-com@2.3.2/dist/email.min.js"
        ></script>
        <script type="text/javascript">{this.emailMethod()}</script>
        <h1 className="Password-Change">Change Password</h1>
        <form onSubmit={this.changer}>
          <h4 id="explain">
            When you submit your email a email will be sent with a code you will
            use to change your password
          </h4>
          <label className= "lab">
            YOUR EMAIL:
            <input  type="text" onChange={this.setHash}></input>
            <br />
          </label>
          <br />
          <button type="submit" className="login-submit">Send Email</button>
        </form>
        <br />
        <form onSubmit={this.sendPass}>
          <br />
          <label className= "lab">
            YOUR CODE: 
            <input type="text" onChange={this.setInput} style={ {marginRight: 30}}></input>
          </label>
          <label className= "lab">
            YOUR NEW PASSWORD: 
            <input type="text" onChange={this.setnewPass} ></input>
          </label>
          <br />
          <br />
          <button type="submit" className="tosignup-submit">
            Change
          </button>
        </form>
      </div>
      </div>
    );
  }
}
