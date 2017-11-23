import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Container from 'components/Container';
import map from 'lodash/map';

@inject('ReportsStore', 'SnackbarStore') @observer class Data extends Component {
	render() {
		const { ReportsStore, match: { params: { id, rep } } } = this.props,
			report = ReportsStore.findById(id, rep, true);

		return (
			<Container>
				<h2>Metrics</h2>
				{ map(report.model ? report.model.metrics : {}, (metric, key) => (
					<p key={key}>
						<span><strong>{ metric.name }:</strong> { metric.help }</span><br />
						<input
							type={metric.type}
							placeholder={metric.name}
							value={ReportsStore.getMetricValue(id, rep, key)}
							onInput={ReportsStore.linkMetric(id, rep, key)}
						/>
					</p>
				)) }
			</Container>
		);
	}
}

export default Data;