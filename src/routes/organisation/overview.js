import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Chart from 'components/Chart';
import findKey from 'lodash/findKey';
import Grid from 'components/Grid';
import Main from 'components/Main';
import map from 'lodash/map';

@inject('ReportsStore') @observer class Overview extends Component {

	render() {
		const { ReportsStore, match: { params: { id } } } = this.props,
			reports = ReportsStore.findById(id, null, true);

		const mostRecentId = findKey(reports, 'model');

		if (!mostRecentId) return null;

		const mostRecentObj = reports[mostRecentId],
			indicators = mostRecentObj.model.indicators;

		return (
			<Main container>
				<Grid childMinWidth={400}>
					{ map(indicators, (indicator, key) => {
						const labels = map(reports, (report) => report.name),
							values = Object.keys(reports).map((repId) => ReportsStore.computeIndicator(id, repId, indicator)),
							data = {
								labels,
								datasets: [{
									title: indicator.name,
									values
								}]
							};

						return (
							<Chart
								key={key}
								title={indicator.name}
								data={data}
							/>
						);
					}) }
				</Grid>
			</Main>
		);
	}
}

export default Overview;