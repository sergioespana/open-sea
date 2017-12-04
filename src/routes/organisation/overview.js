import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Chart from 'components/Chart';
import findKey from 'lodash/findKey';
import Grid from 'components/Grid';
import includes from 'lodash/includes';
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
						if (!includes(['number', 'percentage', 'list', 'likert'], indicator.type)) return null;

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
								colors={['#80CBC4']}
								format_tooltip_y={d => indicator.type === 'percentage'? d + '%' : d}
							/>
						);

					}) }
				</Grid>
			</Main>
		);
	}
}

export default Overview;