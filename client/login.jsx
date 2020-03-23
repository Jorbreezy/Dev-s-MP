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
      <div className="Auth">
        <h1>Login/Signup</h1>
        <div className="innerBox">
          <div className="innerItem">
            <input id="username" type="text" placeholder="Username"></input>
          </div>
          <div className="innerItem">
            <input id="password" type="password" placeholder="Password"></input>
          </div>
        </div>
        <div className="innerItem">
          <button className="innerBtn" onClick={() => this.login()}>
            Login
          </button>
          <button className="innerBtn" onClick={() => this.register()}>
            Signup
          </button>
        </div>
      </div>
    )
  }
}

render(<Login/>, document.getElementById("root"));