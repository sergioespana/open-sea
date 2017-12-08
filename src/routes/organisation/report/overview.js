import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Chart from 'components/Chart';
import Container from 'components/Container';
import map from 'lodash/map';
import { Redirect } from 'react-router-dom';
import toNumber from 'lodash/toNumber';

@inject('ReportsStore', 'SnackbarStore') @observer class Overview extends Component {
	componentDidMount() {
		const { ReportsStore, SnackbarStore, match: { params: { id, rep } } } = this.props,
			report = ReportsStore.findById(id, rep);

		if (!report.has('data')) return SnackbarStore.show('Unable to show report, please input some data first');
	}

	render() {
		const { ReportsStore, match: { params: { id, rep } } } = this.props,
			report = ReportsStore.findById(id, rep),
			model = report.get('model');

		if (!report.has('data')) return <Redirect to={`/${id}/${rep}/data`} replace />;

		return (
			<Container>
				{ map(model ? model.reportItems : {}, (item, key) => {
					if (item.chart) {
						const labels = item.data.map(ind => model.indicators[ind].name);
						const data = {
							labels,
							datasets: [{
								values: item.data.map(ind => toNumber(ReportsStore.computeIndicator(id, rep, model.indicators[ind])))
							}]
						};

						return (
							<Chart
								title={item.name}
								key={key}
								type={item.chart === 'pie' ? 'percentage' : item.chart}
								data={data}
							/>
						);
					}

					return null;
				}) }
			</Container>
		);
	}
}

export default Overview;