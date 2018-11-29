import React, { Component } from 'react';
import './TemperatureChart.css';
var LineChart  = require("react-chartjs-2").Line;
require('chart.js');
require('chartjs-plugin-datalabels');

class TemperatureChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      options: {
        title: {
          display: true,
          text: 'Variação de temperatura dos últimos 15 dias'
        }
      },
      chartData: {}
    };
    this.updateData();
  }

  updateData() {
    this.loadData()
        .then((res) => {
          this.setState( { chartData: this.processData(res) } );
          setTimeout(() => this.updateData(), 3000);
        })
        .catch(err => console.log(err));
  }

  loadData = async () => {
    const response = await fetch('/api/last-temperatures');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  }

  labelFormater(value, context) {
    return value + " °C";
  }

  processData(temperatures) {
    var arrLabels = [];
    var arrMin = [];
    var arrMax = [];
    for (var i = 0; i < temperatures.length; i++) {
      arrLabels.push(temperatures[i].date);
      arrMin.push(temperatures[i].min);
      arrMax.push(temperatures[i].max);
    }

    return {
      labels: arrLabels,
      datasets: [
        {
          label: "Mínima",
          borderColor: 'blue',
          data: arrMin,
          datalabels: {
            backgroundColor: 'blue',
            color: 'white',
            formatter: this.labelFormater
          }
        },
        {
          label: "Máxima",
          borderColor: 'red',
          data: arrMax,
          datalabels: {
            backgroundColor: 'red',
            color: 'white',
            formatter: this.labelFormater
          }
        }
      ]
    };
  }

  render() {
    return (
      <LineChart data={this.state.chartData} options={this.state.options} width={200} height={100} />
    );
  }
}

export default TemperatureChart;