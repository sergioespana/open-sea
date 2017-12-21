import { inject, observer } from 'mobx-react';
import { Link, Route, Switch } from 'react-router-dom';
import React, { Component } from 'react';
import SideList, { Group, ListItem } from 'components/SideList';
import Container from 'components/Container';
import Data from './data';
import findLastKey from 'lodash/findLastKey';
import Header from 'components/Header';
import Helmet from 'react-helmet';
import Main from 'components/Main';
import Overview from './overview';
import Placeholder from 'components/Placeholder';

@inject('OrganisationsStore', 'ReportsStore', 'SnackbarStore') @observer class Report extends Component {
	componentDidMount() {
		const { ReportsStore, SnackbarStore, match: { params: { id, rep } } } = this.props,
			report = ReportsStore.findById(id, rep),
			reports = ReportsStore.findById(id, null, true),
			reportKeys = Object.keys(reports);

		if (report.has('model') || reportKeys.length <= 1) return;

		const mostRecentId = findLastKey(reports, 'model');
		if (mostRecentId) SnackbarStore.show(`Model from a previous report (${reports[mostRecentId].name}) is available`, 0, 'USE', ReportsStore.copyModel(id, mostRecentId, rep));
	}

	componentWillUnmount() {
		this.props.SnackbarStore.hide();
	}

	render() {
		const { OrganisationsStore, ReportsStore, match: { params: { id, rep } } } = this.props,
			organisation = OrganisationsStore.findById(id, true),
			report = ReportsStore.findById(id, rep);

		return (
			<Main>
				<Helmet title={`${organisation.name} / ${report.get('name')}`} />
				<Header
					breadcrumbs={[
						<Link to={`/${id}/reports`}>{ organisation.name }</Link>,
						<Link to={`/${id}/${rep}`}>{ report.get('name') }</Link>
					]}
					title={report.get('name')}
				/>
				<Container flex={report.has('model')}>
					{ report.has('model') ? (
						<React.Fragment>
							<SideList>
								<Group>
									<ListItem to={`/${id}/${rep}`}>Report</ListItem>
									<ListItem to={`/${id}/${rep}/data`}>Data</ListItem>
								</Group>
							</SideList>
							<Switch>
								<Route path="/:id/:rep" exact component={Overview} />
								<Route path="/:id/:rep/data" component={Data} />
							</Switch>
						</React.Fragment>
					) : (
						<Placeholder>
							<h1>No model to work with</h1>
							<p>To get started, <a>upload a model</a> or drop one on the screen.</p>
						</Placeholder>
					) }
				</Container>
			</Main>
		);
	}
}

export default Report;