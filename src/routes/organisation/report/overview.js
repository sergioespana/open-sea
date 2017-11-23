import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Container from 'components/Container';
import map from 'lodash/map';

@inject('ReportsStore', 'SnackbarStore') @observer class Overview extends Component {
	render() {
		const { ReportsStore, match: { params: { id, rep } } } = this.props,
			report = ReportsStore.findById(id, rep, true);

		return (
			<Container>
				<h2>Indicators</h2>
				{ map(report.model ? report.model.indicators : {}, (indicator, key) => (
					<div key={key}>
						<span><strong>{ indicator.name }:</strong> { ReportsStore.computeIndicator(id, rep, indicator) }</span>
					</div>
				)) }
			</Container>
		);
	}
}

export default Overview;