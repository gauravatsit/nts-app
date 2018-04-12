import React, { Component } from 'react';
import Highcharts from 'highcharts';
// import drilldown from 'highcharts-drilldown';

class Chart extends Component {

  componentDidMount() {
  	//drilldown(Highcharts);
    this.chart = new Highcharts.Chart(this.props.container, this.props.options);
    this.chart.reflow()
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    return <div className="chart-container" id={this.props.container} />
  }
}

export default Chart;