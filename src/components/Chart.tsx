import Frappe from 'frappe-charts/dist/frappe-charts.min.esm.js';
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

export default class Chart extends Component {
	chart = null;

	componentDidMount () {
		this.chart = new Frappe({ parent: findDOMNode(this), ...cloneDeep(this.props) });
	}

	render () {
		return <ChartWrapper />;
	}
}
