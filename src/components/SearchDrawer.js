import { Content, Group, Header, Inner, Button, Section } from 'components/Navigation';
import Drawer, { Input } from 'components/Drawer';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import linkState from 'linkstate';
import map from 'lodash/map';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import MdHome from 'react-icons/lib/md/home';
import { stringify } from 'query-string';
import { withRouter } from 'react-router-dom';

const iconProps = { width: 24, height: 24 };

@inject(app('OrganisationsStore', 'VisualStore'))
@observer
class SearchDrawer extends Component {
	state = {
		query: ''
	}

	onSubmit = (event) => {
		event.preventDefault();
		const { query } = this.state;
		const { history, VisualStore } = this.props;

		this.setState({ query: '' });
		VisualStore.toggleSearchDrawer();
		history.push({
			pathname: '/search',
			search: stringify({ q: query })
		});
	}

	render = () => {
		const { query } = this.state;
		const { state, VisualStore } = this.props;
		const { searchDrawerOpen: open } = state;
		const toggle = VisualStore.toggleSearchDrawer;

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
							<Content>
								<form style={{ width: '100%' }} onSubmit={this.onSubmit}>
									<Input
										type="text"
										value={query}
										autoFocus={open}
										onChange={linkState(this, 'query')}
										placeholder="Search for organisations, reports, and more..."
									/>
								</form>
							</Content>
						</Content>
					</Inner>
				</Section>
			</Drawer>
		);
	}
}

export default withRouter(SearchDrawer);