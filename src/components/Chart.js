import 'frappe-charts/dist/frappe-charts.min.css';
import React, { Component } from 'react';
import Frappe from 'frappe-charts/dist/frappe-charts.min.esm.js';

class Chart extends Component {
	componentDidMount() {
		this.c = new Frappe({
			parent: this.chart,
			...this.props
		});
	}

	componentWillReceiveProps(nextProps) {
		this.c = new Frappe({
			parent: this.chart,
			...nextProps
		});
	}

	render = () => <div ref={chart => this.chart = chart} />
}

export default Chart;