import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import Chart from 'components/Chart';
import Container from 'components/Container';
import Grid from 'components/Grid';
import Header from 'components/Header';
import Helmet from 'react-helmet';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import { Link } from 'react-router-dom';
import Main from 'components/Main';
import map from 'lodash/map';
import Placeholder from 'components/Placeholder';

@inject(app('OrganisationsStore', 'ReportsStore'))
@observer
class Overview extends Component {

	formatTooltip = ({ type }) => (value = 0) => type === 'percentage' ? `${value}%` : `${value}`;

	render() {
		const { match: { params: { id } }, OrganisationsStore, ReportsStore } = this.props;
		const organisation = OrganisationsStore.findById(id);
		const reports = ReportsStore.findByOrgId(id);
		const mostRecent = ReportsStore.findMostRecentWithKey(id, 'model');

		return (
			<Main>
				<Helmet title={`${organisation.name} / overview`} />
				<Header title="Overview" />
				<Container>
					{ isEmpty(mostRecent) ? (
						<Placeholder>
							<h1>No reports with data to show</h1>
							<p>To get started, <Link to={`/${id}/new`}>create a report</Link> or add data to an existing report.</p>
						</Placeholder>
					) : (
						<Grid childMinWidth={400}>
							{ map(mostRecent.model.indicators, (indicator, key) => {
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