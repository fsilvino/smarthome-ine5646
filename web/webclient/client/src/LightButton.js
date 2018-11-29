import React, { Component } from 'react';
import lightOn from './img/light-on.png'
import lightOff from './img/light-off.png'
import './LightButton.css';

class LightButton extends Component {

  constructor(props) {
    super(props);
    this.state = { value: 0 };
    this.updateLightState();
  }

  isOn() {
    return this.state.value === 1;
  }

  getButtonImage() {
    if (this.isOn()) {
      return lightOn;
    }
    return lightOff;
  }

  getTitle() {
    if (this.isOn()) {
      return "Apagar lâmpada";
    }
    return "Acender lâmpada";
  }

  loadState = async () => {
    const response = await fetch(this.props.url + '/api/light/' + this.props.lampId);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  updateLightState() {
    this.loadState()
        .then((res) => {
          this.setState({ value: res.value });
          setTimeout(() => this.updateLightState(), 10000);
        })
        .catch((err) => {
          console.log(err.message);
        });
  }

  sendCommand = async () => {
    var value = this.state.value === 1 ? 0 : 1;
    console.log(value);
    var led = this.props.lampId;

    const response = await fetch('/api/light/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ led: led, state: value, boardId: this.props.boardId})
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  }

  toggleLight() {
    this.sendCommand()
      .then((res) => {
        this.setState({ value: res.value });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="LightButton" title={this.getTitle()} onClick={() => this.toggleLight()} >
        <img src={this.getButtonImage()} alt="Light" />
        <span className="LightButtonName">Lâmpada {this.props.lampId}</span>
      </div>
    );
  }
}

export default LightButton;
