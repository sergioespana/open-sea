import Header, { Section } from 'components/Header';
import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { app } from 'mobx-app';
import Container from 'components/Container';
import Helmet from 'react-helmet';
import linkState from 'linkstate';
import map from 'lodash/map';
import PeopleButton from 'components/PeopleButton';
import reject from 'lodash/reject';
import sortBy from 'lodash/sortBy';
import { TextField } from 'components/Input';

@inject(app('AuthStore'))
@observer
class DashboardPeople extends Component {
	state = {
		query: ''
	}

	render = () => {
		const { AuthStore, state } = this.props;
		const { authed } = state;
		const { query } = this.state;

		const users = query === '' ? [ authed, ...sortBy(reject(state.users, ['_uid', authed._uid]), ['name']) ] : AuthStore.search(query);

		return (
			<Fragment>
				<Helmet>
					<title>dashboard / people</title>
				</Helmet>
				<Header>
					<Section>
						<h1>People</h1>
					</Section>
				</Header>
				<Container width={70}>
					<TextField
						placeholder="Search by full name"
						value={query}
						onChange={linkState(this, 'query')}
					/>
				</Container>
				<Container flex width={70}>
					{ map(users, (user) => <PeopleButton key={user._uid} user={user} />) }
				</Container>
			</Fragment>
		);
	}
}

export default DashboardPeople;