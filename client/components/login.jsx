import React, { Component } from "react";

class Login extends Component {
  render() {
    return (
      <div className="Auth">
      <div>
        <h1>Login</h1>
        <div className="innerBox">
          <div className="innerItem">
            <input id="username" type="text" placeholder="Username"></input>
          </div>
          <div className="innerItem">
            <input id="password" type="password"placeholder="Password"></input>
          </div>
          <div className="innerItem">
            <button className='innerBtn' onClick={this.props.auth}>Login</button>
          </div>
        </div>
      </div>
      <div className="otherBtn">
        <button className='outerBtn' onClick={this.props.signup}>Signup</button>
      </div>
    </div>
    );
  }
}

export default Login;
