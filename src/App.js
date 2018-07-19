import React, { Component } from 'react';
import Camera from './components/camera'
require('./secrets')

class App extends Component {
  render() {
    return (
      <div className="App">
        <Camera />
      </div>
    );
  }
}

export default App;
