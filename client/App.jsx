import React, { Component } from 'react';
import { render } from 'react-dom';
import Wrapper from './components/mainContainer';

class App extends Component {
  render() {
    return (
      <Wrapper />
    );
  }
}

render(<App />, document.querySelector('#root'));
