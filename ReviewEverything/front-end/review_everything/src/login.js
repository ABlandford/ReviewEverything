import React, { Component } from "react";
import "./App.css";
import { Redirect, Link } from "react-router-dom";
import Cookies from "universal-cookie";
import emailjs from "emailjs-com";

const cookies = new Cookies();

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      redirect: null,
      fails: 0,
      botCheckVal: ""
    };
    this.usernameUpdate = this.usernameUpdate.bind(this);
    this.passcodeUpdate = this.passcodeUpdate.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
    this.redirectToSignUp = this.redirectToSignUp.bind(this);
    this.botCheckUpdate = this.botCheckUpdate.bind(this);
    this.emailMethod = this.emailMethod.bind(this);
    // this.addAdmin = this.addAdmin.bind(this);
  }

  //   addAdmin(event) {
  //     event.preventDefault();

  //     fetch('http://localhost:9000/test/addAdmin', {
  //       method: 'GET',
  //     });
  //   }

  redirectToSignUp(event) {
    event.preventDefault();

    this.setState({ redirect: "/signup" });
  }

  botCheckUpdate(event) {
    this.setState({ botCheckVal: event.target.value });
  }

  usernameUpdate(event) {
    this.setState({ username: event.target.value });
  }

  passcodeUpdate(event) {
    this.setState({ password: event.target.value });
  }

  forgot() {
    this.setState({ redirect: "/forgot" });
  }

  emailMethod() {
    emailjs.init("user_NzA1tUX4PMLx4sM7kfzLy");
  }

  checkLogin(event) {
    event.preventDefault();
    const data = {
      username: this.state.username,
      password: this.state.password
    };

    fetch("http://localhost:9000/test/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(json => {
        if (json.status === true) {
          if (this.state.botCheckVal) {
            alert("BOT DETECTED!");
          } else {
            if (json.locked === false) {
            console.log("Login status: " + json.status);
            console.log(json.user);
            cookies.set("currentUser", JSON.stringify(json.user), {
              path: "/"
            });
            this.setState({ redirect: "/home" })} 
          
              if (json.locked === true) {
                console.log("BRUH??");
                console.log(json.passwordFail)
                alert("You're account is locked, check your email");
                this.setState({ redirect: "/forgot" });
              }
             
          }
        } else {
          if (this.state.botCheckVal) {
            alert("BOT DETECTED!");
          } else {
            console.log("Login status: " + json.status);
            console.log(
              "The information you entered was incorrect. See status message below."
            );
            console.log(json.statusMessage);
            if (json.passwordFail) {
              let numbFails = this.state.fails;
              numbFails++;
              console.log("numbFails: " + numbFails);
              this.setState({ fails: numbFails });
              console.log("State of fails: " + this.state.fails);
            }
            alert(json.statusMessage);
          }
          if (this.state.fails === 2) {
            alert(
              "WARNING!!!\n\n You have reached 10 attempts at inputing the correct password."
            );

            const data = { username: this.state.username };
            fetch("http://localhost:9000/test/lockAccount", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(data)
            })
              .then(response => response.json())
              .then(json => {
                console.log(json.username + " #####");
                console.log(json.username);
                console.log(json.locked);
                console.log(json.email);

                if (json.locked === true) {
                  console.log("HELLO??");
                  this.setState({ redirect: "/" });
                  alert("You're account is locked, check your email");
                  emailjs
                    .send("gmail", "template_7UrREfLB", { email: json.email })
                    .then(
                      function(response) {
                        console.log("SUCCESS!", response.status, response.text);
                      },
                      function(err) {
                        console.log("FAILED...", err);
                      }
                    );
                }
              });
          }
        }
      });
  }

  componentDidMount() {
    if (!cookies.get("currentUser")) {
      console.log("No cookie exists. Login or signup to create your cookie.");
    } else {
      this.setState({ redirect: "/home" });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className="login-display">
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
          <h1 className="login-header">Login</h1>
        </div>
        <div className="login-form">
          <form onSubmit={this.checkLogin}>
            <label>Username: <input className='login-input' type='text' value={this.state.username} onChange={this.usernameUpdate}></input></label><br/>
            <label>Password: <input className='login-input' type='password' value={this.state.password} onChange={this.passcodeUpdate}></input></label><br/>
            <input type='hidden' name='password' value={this.state.botCheckVal} onChange={this.botCheckUpdate}/>
            <input className='login-submit' type='submit' value='Log In'></input>
          </form>
          <form onSubmit={this.redirectToSignUp}>
            <input
              className="tosignup-submit"
              type="submit"
              value="Sign Up"
            ></input>
          </form>
          <button
            className=""
            className='forgot-submit'
            onClick={() => {
              this.forgot();
            }}
          >
            Forgot Password?
          </button>
        </div>
        {/* <form onSubmit={this.addAdmin}>
            <input type='submit' value='Add Admin'/>
          </form> */}
      </div>
    );
  }
}
