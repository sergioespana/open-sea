import Header, { Section } from 'components/Header';
import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Container from 'components/Container';
import Helmet from 'react-helmet';
import linkState from 'linkstate';
import map from 'lodash/map';
import reject from 'lodash/reject';
import sortBy from 'lodash/sortBy';
import styled from 'styled-components';
import { TextField } from 'components/Input';

const PeopleButton = styled(({ className, user, ...props }) => (
	<Button
		appearance="subtle"
		className={className}
		to={`/dashboard/people/${user._uid}`}
	>
		<img src={user.avatar} />
		<span>{ user.name }</span>
	</Button>
))`
	height: 160px;
	flex: 0 0 160px;
	flex-direction: column;
	justify-content: center;

	img {
		display: block;
		margin: 0 auto;
		border-radius: 50%;
		width: 65%;
	}

	span {
		margin-top: 12px;
	}
`;

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
				<Container>
					<TextField
						fullWidth
						placeholder="Search by full name"
						value={query}
						onChange={linkState(this, 'query')}
					/>
				</Container>
				<Container flex>
					{ map(users, (user) => <PeopleButton key={user._uid} user={user} />) }
				</Container>
			</Fragment>
		);
	}
}

export default DashboardPeople;