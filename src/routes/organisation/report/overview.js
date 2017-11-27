import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Container from 'components/Container';
import map from 'lodash/map';
import { Redirect } from 'react-router-dom';

@inject('ReportsStore', 'SnackbarStore') @observer class Overview extends Component {
	componentDidMount() {
		const { ReportsStore, SnackbarStore, match: { params: { id, rep } } } = this.props,
			report = ReportsStore.findById(id, rep);

		if (!report.has('data')) return SnackbarStore.show('Unable to show report: not enough data');
	}

	render() {
		const { ReportsStore, match: { params: { id, rep } } } = this.props,
			report = ReportsStore.findById(id, rep),
			model = report.get('model');

		if (!report.has('data')) return <Redirect to={`/${id}/${rep}/data`} replace />;

		return (
			<Container>
				{ map(model ? model.indicators : {}, (indicator, key) => (
					<div key={key}>
						<span><strong>{ indicator.name }:</strong> { ReportsStore.computeIndicator(id, rep, indicator) }</span>
					</div>
				)) }
			</Container>
		);
	}
}

export default Overview;