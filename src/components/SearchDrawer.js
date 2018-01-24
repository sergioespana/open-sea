import { Content, Group, Header, Inner, Button, Section } from 'components/Navigation';
import Drawer, { Input } from 'components/Drawer';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import linkState from 'linkstate';
import map from 'lodash/map';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import MdAssessment from 'react-icons/lib/md/assessment';
import MdHome from 'react-icons/lib/md/home';
import partition from 'lodash/partition';
import { stringify } from 'query-string';
import { withRouter } from 'react-router-dom';

const iconProps = { width: 24, height: 24 };

@inject(app('OrganisationsStore', 'ReportsStore', 'VisualStore'))
@observer
class SearchDrawer extends Component {
	state = {
		query: ''
	}

	onSubmit = (event) => {
		event.preventDefault();
		const { query } = this.state;
		const { history, VisualStore } = this.props;

		VisualStore.toggleSearchDrawer();
		history.push({
			pathname: '/search',
			search: stringify({ q: query })
		});
	}

	componentDidUpdate = () => {
		const { query } = this.state;
		const { state } = this.props;
		const { searchDrawerOpen: open } = state;
		return (!open && query !== '') && this.setState({ query: '' });
	}

	render = () => {
		const { query } = this.state;
		const { OrganisationsStore, ReportsStore, state, VisualStore } = this.props;
		const { searchDrawerOpen: open } = state;
		const toggle = VisualStore.toggleSearchDrawer;

		const [networks, organisations] = partition(OrganisationsStore.search(query), ['isNetwork', true]);
		const reports = ReportsStore.search(query);

		return (
			<Drawer open={open} onRequestClose={toggle}>
				<Section width={64} bg="#fff">
					<Inner>
						<Content>
							<Header>
								<Button round disabled><MdHome {...iconProps} /></Button>
							</Header>
							<Group>
								<Button round onClick={toggle}><MdArrowBack {...iconProps} /></Button>
							</Group>
						</Content>
					</Inner>
				</Section>
				<Section width={490} bg="#fff">
					<Inner>
						<Content fullWidth>
							<Header />
							<Group>
								<form style={{ width: '100%' }} onSubmit={this.onSubmit}>
									<Input
										type="text"
										value={query}
										autoFocus={open}
										onChange={linkState(this, 'query')}
										placeholder="Search for organisations, reports, and more..."
									/>
								</form>
							</Group>
							<Group>
								{ networks.length > 0 && <h3>Networks</h3> }
								{ map(networks, ({ _id, avatar, name }) => (
									<Button
										key={_id}
										to={`/${_id}`}
										onClick={toggle}
									><img src={avatar} style={{ width: 32, height: 32 }} />{ name }</Button>
								)) }
							</Group>
							<Group>
								{ organisations.length > 0 && <h3>Organisations</h3> }
								{ map(organisations, ({ _id, avatar, name }) => (
									<Button
										key={_id}
										to={`/${_id}`}
										onClick={toggle}
									><img src={avatar} style={{ width: 32, height: 32 }} />{ name }</Button>
								)) }
							</Group>
							<Group>
								{ reports.length > 0 && <h3>Reports</h3> }
								{ map(reports, ({ _id, _orgId, name }) => (
									<Button
										key={_id}
										to={`/${_id}`}
										onClick={toggle}
									>
										<MdAssessment
											width={24}
											height={24}
											style={{ marginLeft: 4, padding: 4, borderRadius: '50%', backgroundColor: '#e0e0e0', color: '#a1a1a1' ,boxSizing: 'content-box' }}
										/>
										<div style={{ display: 'flex', flexDirection: 'column' }}>
											<span>{ name }</span>
											<span style={{ fontSize: '0.75rem' }}>{ OrganisationsStore.getItem(_orgId, '_id').name }</span>
										</div>
									</Button>
								)) }
							</Group>
						</Content>
					</Inner>
				</Section>
			</Drawer>
		);
	}
}

export default withRouter(SearchDrawer);