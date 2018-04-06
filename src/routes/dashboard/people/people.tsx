import Fuse from 'fuse.js';
import linkState from 'linkstate';
import { find, map, reject, sortBy } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import MdSearch from 'react-icons/lib/md/search';
import { Container } from '../../../components/Container';
import { EmptyState } from '../../../components/EmptyState';
import { Header } from '../../../components/Header';
import { TextField } from '../../../components/Input';
import { Section } from '../../../components/Section';
import { UserGrid, UserGridItem } from '../../../components/UserGrid';
import { User } from '../../../domain/User';

interface State {
	searchable: Fuse;
	query: string;
}

@inject(app('state'))
@observer
export default class DashboardPeopleOverview extends Component<any, State> {
	state: State = {
		searchable: new Fuse([], { keys: ['name', 'email'] }),
		query: ''
	};

	searchable = null;

	componentDidMount () {
		return this.componentWillReceiveProps(this.props);
	}

	componentWillReceiveProps (nextProps) {
		const { state } = nextProps;
		return this.setState({ searchable: new Fuse(state.users, { keys: ['name', 'email'] }) });
	}

	render () {
		const { state } = this.props;
		const { searchable, query } = this.state;
		const users: User[] = query === '' ? [
			find(state.users, { _isCurrent: true }) as User,
			...sortBy(reject(state.users, { _isCurrent: true }), ['name']) as User[]
		] : searchable.search(query);

		return (
			<React.Fragment>
				<Header title="People" headTitle="dashboard / people" />
				<Container style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 1024, padding: '0 20px' }}>
					<Section>
						<TextField
							onChange={linkState(this, 'query')}
							placeholder="Search by full name or email address"
							prefixElement={<MdSearch />}
							value={query}
						/>
						{users.length > 0 ? (
							<UserGrid>
								{map(users, ({ _id, avatar, name }: User) => (
									<UserGridItem
										appearance="subtle"
										key={_id}
										to={`/dashboard/people/${_id}`}
									>
										<img src={avatar} />
										<span>{name}</span>
									</UserGridItem>
								))}
							</UserGrid>
						) : (
							<EmptyState>
								<img src="/assets/images/empty-state-taken.svg" />
								<h1>Couldn't find that user</h1>
								<p>
									It's possible that you're looking for someone you haven't worked with yet,
									or the user simply does not exist.
								</p>
							</EmptyState>
						)}
					</Section>
				</Container>
			</React.Fragment>
		);
	}
}
