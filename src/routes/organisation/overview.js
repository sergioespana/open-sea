import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Chart from 'components/Chart';
import Container from 'components/Container';
import findLastKey from 'lodash/findLastKey';
import Grid from 'components/Grid';
import Header from 'components/Header';
import Helmet from 'react-helmet';
import includes from 'lodash/includes';
import { Link } from 'react-router-dom';
import Main from 'components/Main';
import map from 'lodash/map';
import Placeholder from 'components/Placeholder';

@inject('OrganisationsStore', 'ReportsStore') @observer class Overview extends Component {

	formatTooltip = (indicator) => (value) => {
		if (!value) value = 0;
		if (indicator.type === 'percentage') return `${value}%`;
		return value;
	}

	render() {
		const { OrganisationsStore, ReportsStore, match: { params: { id } } } = this.props,
			reports = ReportsStore.findById(id, null, true);

		const mostRecentId = findLastKey(reports, 'model');

		return (
			<Main>
				<Helmet title={`${OrganisationsStore.findById(id, true).name} / overview`} />
				<Header title="Overview" />
				<Container>
					{ !mostRecentId ? (
						<Placeholder>
							<h1>No reports with data to show</h1>
							<p>To get started, <Link to={`/${id}/new`}>create a report</Link> or add data to an existing report.</p>
						</Placeholder>
					) : (
						<Grid childMinWidth={400}>
							{ map(reports[mostRecentId].model.indicators, (indicator, key) => {
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
										format_tooltip_y={this.formatTooltip(indicator)}
									/>
								);

							}) }
						</Grid>
					) }
				</Container>
			</Main>
		);
	}
}

export default Overview;