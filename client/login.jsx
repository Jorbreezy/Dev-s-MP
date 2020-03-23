import React, { Component } from 'react';
import { render } from 'react-dom';

class Login extends Component {
  constructor(){
    super();

  }
  register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log(username, password)
    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username, password})
    })
    .then(res => res.json())
    .then(json => {
      if (json.message === "successful register") {
        fetch("/secondredirect", {
          method: "GET", redirect: "follow"
        })
        .then(response => {
          window.location.href = response.url
        })
      }
    })
  }
  login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username, password})
    })
    .then(res => res.json())
    .then(json => {
      if (json.message === "successful login") {
        fetch("/secondredirect", {
          method: "GET", redirect: "follow"
        })
        .then(response => {
          window.location.href = response.url
        })
      }
    })
  }
  render() {
    return(
      <div>
        <span>Username</span>
        <input id = "username"></input><br/>
        <span>Password</span>
        <input id = "password"></input><br/>
        <button id = "login" onClick = {() => {this.login()}}>Log In</button>
        <button id = "register" onClick = {() => {this.register()}}>Register</button>
      </div>
    )
  }
}

render(<Login/>, document.getElementById("root"));