import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from './login';

class MainContainer extends Component {
  render() {
    return (
      <div>
        <Login />
      </div>
    );
  }
}

export default MainContainer;
