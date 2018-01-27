import Header, { Actions, Breadcrumbs, Section } from 'components/Header';
import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Chart from 'components/Chart';
import Container from 'components/Container';
import findLast from 'lodash/findLast';
import Helmet from 'react-helmet';
import HiddenOnPrint from 'components/HiddenOnPrint';
import isEmpty from 'lodash/isEmpty';
import { Link } from 'components/Link';
import map from 'lodash/map';
import MdMoreVert from 'react-icons/lib/md/more-vert';
import Placeholder from 'components/Placeholder';
import { withRouter } from 'react-router-dom';

@inject(app('OrganisationsStore', 'ReportsStore'))
@observer
class OrganisationReport extends Component {

	copyModel = async () => {
		const { history, match: { params: { orgId, repId } }, ReportsStore } = this.props;
		const reports = ReportsStore.getItems({ _orgId: orgId });
		const mostRecent = findLast(reports, 'model') || {};
		const mostRecentModel = mostRecent.model || {};

		await ReportsStore.addModel(orgId, repId, mostRecentModel);
		history.push(`/${orgId}/${repId}/data`);
	}

	render = () => {
		const { match: { params: { orgId, repId } }, OrganisationsStore, ReportsStore } = this.props;
		const organisation = OrganisationsStore.getItem(orgId, '_id');
		const reports = ReportsStore.getItems({ _orgId: orgId });
		const report = ReportsStore.getItem(`${orgId}/${repId}`, '_id');
		const data = report._data;
		const model = report.model || {};
		const indicators = model.indicators || {};
		const reportItems = model.reportItems || [];

		const mostRecent = findLast(reports, 'model') || {};
		const mostRecentModel = mostRecent.model || {};

		return (
			<Fragment>
				<Helmet title={`${organisation.name} / ${report.name}`} />
				<Header>
					<Section>
						<HiddenOnPrint>
							<Breadcrumbs>
								<Link to={`/${orgId}`}>{ organisation.name }</Link>
								<Link to={`/${orgId}/reports`}>Reports</Link>
							</Breadcrumbs>
						</HiddenOnPrint>
						<HiddenOnPrint reverse><h1>{ organisation.name }</h1></HiddenOnPrint>
						<h1>{ report.name }</h1>
					</Section>
					<HiddenOnPrint>
						<Actions>
							{ (!isEmpty(model) && !isEmpty(data)) && <Button bg="light" color="primary" to={`/${orgId}/${repId}/data`}>Edit data</Button> }
							<Button bg="light" color="primary" onClick={window.print}>Export</Button>
							<Button bg="light" color="primary"><MdMoreVert width={24} height={24} style={{ transform: 'rotate(90deg)' }} /></Button>
						</Actions>
					</HiddenOnPrint>
				</Header>
				<Container>
					{ isEmpty(model) ? (
						<Placeholder>
							<h1>Whoa there!</h1>
							<p>
								<span>No model exists for this report. Drop one on the screen to get started</span>
								{ !isEmpty(mostRecentModel) && <span>,<br /> or <a onClick={this.copyModel}>use the one from the previous report</a></span> }
								<span>.</span>
							</p>
						</Placeholder>
					) : isEmpty(data) ? (
						<Placeholder>
							<h1>Whoa there!</h1>
							<p>No data exists for this report. Add some data to get started.</p>
							<p><Button to={`/${orgId}/${repId}/data`}>Add data</Button></p>
						</Placeholder>
					) : map(reportItems, (item, i) => {
						const data = {
							labels: map(item.data, (indId) => indicators[indId].name),
							datasets: [{
								values: map(item.data, (indId) => ReportsStore.compute(orgId, repId, indId))
							}]
						};

						return (
							<Chart
								key={i}
								title={item.name}
								type={item.chart === 'pie' ? 'percentage' : item.chart}
								data={data}
								colors={item.colors || []}
							/>
						);
					}) }
				</Container>
			</Fragment>
		);
	}
}

export default withRouter(OrganisationReport);