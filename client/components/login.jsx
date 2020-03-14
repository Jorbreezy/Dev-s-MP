import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Link
} from "react-router-dom";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: false
    };
  }

  login = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

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

      if(results.message === 'Login Successful'){
        this.setState({ isAuthenticated: true });
        //Redirect('/marketplace');
      } 

    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
        <form>
          <label>Login</label>
          <input name="username" id='username' type="text" placeholder="username"></input>
          <input name="password" id='password' type="password" placeholder="password"></input>
          <button onClick={() => this.login()}>Login</button>
        </form>
    );
  }
}

export default Login;
