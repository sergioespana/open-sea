import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm.js';
import { cloneDeep } from 'lodash';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styled from '../util/styled-components';

const ChartWrapper = styled.div`
	& .title,
	& .sub-title {
		display: none;
	}
`;

export default class ReactChart extends Component {
	componentDidMount () {
		const chart = new Chart(findDOMNode(this), { ...cloneDeep(this.props) });
		chart.unbindWindowEvents();
	}

	render () {
		return <ChartWrapper />;
	}
}
