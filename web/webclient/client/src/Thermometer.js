import React, { Component } from 'react';
import thermometer from './img/thermometer.png'
import thermometerHot from './img/thermometer-hot.png'
import thermometerCold from './img/thermometer-cold.png'
import './Thermometer.css';

class Thermometer extends Component {

    constructor(props) {
      super(props);
      this.state = { temperature: 0 };
      this.updateTemperature();
    }

    updateTemperature() {
        this.loadTemperature()
            .then((res) => {
              this.setState( { temperature: res.temperature } );
              setTimeout(() => this.updateTemperature(), 5000);
            });
            //.then(err => console.log(err));
    }

    loadTemperature = async () => {
        const response = await fetch('/api/temperature');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    }
  
    isHot() {
      return this.state.temperature >= 30;
    }

    isCold() {
        return this.state.temperature <= 20;
    }
  
    getImage() {
      if (this.isHot()) {
        return thermometerHot;
      } else if (this.isCold()) {
          return thermometerCold;
      }
      return thermometer;
    }
  
    render() {
      return (
        <div className="Thermometer">
          <img src={this.getImage()} alt="Thermometer" />
          <span className="TemperatureLabel">{this.state.temperature}°C</span>
        </div>
      );
    }
  }
  
  export default Thermometer;
  