import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import { app } from 'mobx-app';
import Chart from 'components/Chart';
import Container from 'components/Container';
import get from 'lodash/get';
import Header from 'components/Header';
import Main from 'components/Main';
import map from 'lodash/map';
import React from 'react';
import toNumber from 'lodash/toNumber';

const Overview = inject(app('ReportsStore', 'SnackbarStore'))(observer(({ ReportsStore, match: { params: { id, rep } } }) => {
	const report = ReportsStore.findById(id, rep);
	const data = get(report, 'data');
	const model = get(report, 'model') || {};

	if (!data) return <Redirect to={`/${id}/${rep}/data`} replace />;

	return (
		<Main>
			<Container>
				{ map(model.reportItems, (item, key) => {
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
		</Main>
	);
}));

export default Overview;