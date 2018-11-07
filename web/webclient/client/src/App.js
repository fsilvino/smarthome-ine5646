import React, { Component } from 'react';
import LightButton from './LightButton'
import Thermometer from './Thermometer'
import TemperatureChart from './TemperatureChart'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="AppTitle">Automação Residencial</div>
          <LightButton lampId="1" />
          <LightButton lampId="2" />
          <Thermometer />
          <TemperatureChart />
        </header>
      </div>
    );
  }
}

export default App;
