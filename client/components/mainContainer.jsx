import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Login from './login';
import SignUp from './signup';
import MarketPlace from './MarketPlace';

class MainContainer extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: false,
      isLoginOpen: true,
      isSignUpOpen: false
    };
  }

  showSignUp = () => {
    this.setState({ isLoginOpen: false, isSignUpOpen: true })
  }

  showLogin = () => {
    this.setState({ isLoginOpen: true, isSignUpOpen: false })
  }


  signUp = async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/JSON"
        },
        body: JSON.stringify({ username: username, password: password })
      });

      const results = await res.json();

      if (results.message === "Signup Successful") {
        console.log("Signup Successful");
        this.setState({ isAuthenticated: true, isSignUpOpen: false });
      } 
    } catch (err) {
      console.log(err);
    }
  }

  login = async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    console.log(username, password);
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/JSON"
        },
        body: JSON.stringify({ username: username, password: password })
      });

      const results = await res.json();

      if (results.message === "Login Successful") {
        console.log("Login Successful");
        this.setState({ isAuthenticated: true, isLoginOpen: false });
      } 
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <div>
        {this.state.isLoginOpen && !this.state.isSignUpOpen &&  <Login signup={ this.showSignUp } auth={this.login}/>}
        {this.state.isSignUpOpen &&  !this.state.isLoginOpen && <SignUp login={ this.showLogin } auth={ this.signUp }/>}
        {this.state.isAuthenticated && <MarketPlace />}
      </div>
    );
  }
}

export default MainContainer;
