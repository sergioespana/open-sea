// import 'frappe-charts/dist/frappe-charts.min.css';
import React, { Component } from 'react';
import Frappe from 'frappe-charts/dist/frappe-charts.min.esm.js';
import theme from '../../theme';

class Chart extends Component {

	componentDidMount = () => this.c = new Frappe({ parent: this.chart, colors: [theme.accent], ...this.props });

	componentWillReceiveProps = (nextProps) => this.c = new Frappe({ parent: this.chart, colors: [theme.accent], ...nextProps });

	render = () => <div ref={chart => this.chart = chart} style={{ maxWidth: '100%' }} />
}

export default Chart;