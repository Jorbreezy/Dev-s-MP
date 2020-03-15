import React, { Component } from 'react';
import { render } from 'react-dom';
import Wrapper from './components/mainContainer';
import css from './styles/styles'

class App extends Component {
  render() {
    return (
      <Wrapper />
    );
  }
}

render(<App />, document.querySelector('#root'));
