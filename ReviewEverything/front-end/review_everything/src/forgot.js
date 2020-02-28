import React, { Component } from "react";
import "./App.css";
import { Redirect, useHistory } from "react-router-dom";
import emailjs from "emailjs-com";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      email: "",
      name: ""
    };
    this.sendEmail = this.sendEmail.bind(this);
    this.emailMethod = this.emailMethod.bind(this);
    // history = useHistory();
    this.addLocked = this.addLocked.bind(this);
    this.setEmail = this.setEmail.bind(this);
  }

  addLocked(event) {
    event.preventDefault();

    fetch("http://localhost:9000/test/locked", {
      method: "GET"
    });
  }

  backHome() {
    this.setState({ redirect: "/" });
  }

  emailMethod() {
    emailjs.init("user_NzA1tUX4PMLx4sM7kfzLy");
  }

  setEmail(event) {
    this.setState({ email: event.target.value });
  }

  sendEmail(event) {
    event.preventDefault();
    const data = { email: this.state.email };
    fetch("http://localhost:9000/test/changePass", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(json => {
        console.log(json.name + " #####");
        this.setState({ name: json.name });
        console.log(this.state.name);
        this.setState({ email: this.state.email, name: json.name });
      });
    emailjs
      .send("gmail", "template_7UrREfLB", {
        email: this.state.email,
        name: this.state.name,
      })
      .then(
        function(response) {
          console.log("SUCCESS!", response.status, response.text);
        },
        function(err) {
          console.log("FAILED...", err);
        }
      );
  }

  componentDidMount() {
    if (!cookies.get("currentEmail")) {
      console.log("No cookie exists. Login or signup to create your cookie.");
    } else {
      this.setState({ name: this.state.name });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

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
          <div className="login-header-container">
            <h1 className="Password-Forget">Forgot Password?</h1>
          </div>

          <form onSubmit={this.sendEmail}>
            <label>
              Your Email Address:{" "}
              <input type="email" onChange={this.setEmail}></input>
            </label>
            <br />
            <br />
            <button type="submit" className="tosignup-submit">
              Send
            </button>
            <button
              className="login-submit"
              id="back"
              onClick={() => {
                this.backHome();
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }
}
