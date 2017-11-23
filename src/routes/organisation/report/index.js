import { inject, observer } from 'mobx-react';
import { Link, Route, Switch } from 'react-router-dom';
import React, { Component } from 'react';
import CenterProgress from 'components/CenterProgress';
import Container from 'components/Container';
import Data from './data';
import Main from 'components/Main';
import Overview from './overview';
import Settings from './settings';

@inject('ReportsStore', 'SnackbarStore') @observer class Report extends Component {
	render() {
		const { ReportsStore, match: { params: { id, rep } } } = this.props,
			report = ReportsStore.findById(id, rep, true);

		return ReportsStore.loading ? (
			<CenterProgress />
		) : (
			<Main>
				<Container>
					<h1>{ report.name }</h1>
					<nav>
						<Link to={`/${id}/${rep}`}>Report</Link> - <Link to={`/${id}/${rep}/data`}>Data</Link> - <Link to={`/${id}/${rep}/settings`}>Settings</Link>
					</nav>
				</Container>
				<Switch>
					<Route path="/:id/:rep" exact component={Overview} />
					<Route path="/:id/:rep/settings" component={Settings} />
					<Route path="/:id/:rep/data" component={Data} />
				</Switch>
			</Main>
		);
	}
}

export default Report;