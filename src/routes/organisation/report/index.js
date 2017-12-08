import { inject, observer } from 'mobx-react';
import { Link, Route, Switch } from 'react-router-dom';
import React, { Component } from 'react';
import Button from 'material-styled-components/Button';
import Container from 'components/Container';
import Data from './data';
import Main from 'components/Main';
import Overview from './overview';
import Placeholder from 'components/Placeholder';
import Settings from './settings';

@inject('ReportsStore') @observer class Report extends Component {
	render() {
		const { ReportsStore, match: { params: { id, rep } } } = this.props,
			report = ReportsStore.findById(id, rep);

		if (!report.has('model')) return (
			<Main bg="#eee">
				<Container>
					<Placeholder>
						<h1>Drop model here</h1>
						<p>To get started, upload a model.</p>
					</Placeholder>
				</Container>
			</Main>
		);

		return (
			<Main>
				<Container>
					<h1>{ report.get('name') }</h1>
					<nav>
						<Link to={`/${id}/${rep}`}><Button primary>Report</Button></Link><Link to={`/${id}/${rep}/data`}><Button primary>Data</Button></Link><Link to={`/${id}/${rep}/settings`}><Button primary>Settings</Button></Link>
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