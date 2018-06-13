import Fuse from 'fuse.js';
import linkState from 'linkstate';
import { find, map, reject, sortBy } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Container from '../../../components/Container';
import EmptyState from '../../../components/EmptyState';
import Header from '../../../components/Header';
import { Input } from '../../../components/NewInput';
import { Section } from '../../../components/Section';
import { UserGrid, UserGridItem } from '../../../components/UserGrid';
import { Model } from '../../../domain/Organisation';

interface State {
	searchable: Fuse;
	query: string;
}

@inject(app('state'))
@observer
export default class DashboardModelsOverview extends Component<any, State> {
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
		return this.setState({ searchable: new Fuse(state.models, { keys: ['name'] }) });
	}

	render () {
		const { state } = this.props;
		const { searchable, query } = this.state;
		const models: Model[] = query === '' ? [
			...sortBy(state.models, ['name']) as Model[]
		] : searchable.search(query);

		return (
			<React.Fragment>
				<Header title="Models" headTitle="dashboard / models" />
				<Container style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 1024, padding: '0 20px' }}>
					<Section>
						<Input
							appearance="default"
							disabled={models.length === 0 && query === ''}
							onChange={linkState(this, 'query')}
							placeholder="Search by model name"
							value={query}
						/>
						{models.length > 0 ? (
							<UserGrid>
								{map(models, ({ _id, name }: Model) => (
									<UserGridItem
										appearance="subtle"
										key={_id}
										to={`/dashboard/models/${_id}`}
									>
										<span>{name}</span>
									</UserGridItem>
								))}
							</UserGrid>
						) : query !== '' ? (
							<EmptyState>
								<img src="/assets/images/empty-state-taken.svg" />
								<h1>Couldn't find that model</h1>
							</EmptyState>
						) : (
							<EmptyState>
								<img src="/assets/images/empty-state-taken.svg" />
								<h1>No models</h1>
								<p>
									The openSEA model repository currently contains no models. Why don't you <a>add one</a>?
								</p>
							</EmptyState>
						)}
					</Section>
				</Container>
			</React.Fragment>
		);
	}
}
