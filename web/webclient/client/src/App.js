import React, {Component} from 'react';
import LightButton from './LightButton'
import Thermometer from './Thermometer'
import TemperatureChart from './TemperatureChart'
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div className="AppTitle">Automação Residencial</div>
                    <LightButton lampId="1" boardId="1"/>
                    <LightButton lampId="2" boardId="1"/>
                    <LightButton boardId="2"/>
                    <Thermometer boardId="1"/>
                    <Thermometer boardId="2"/>
                    <TemperatureChart/>
                </header>
            </div>
        );
    }
}

export default App;
