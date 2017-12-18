import Drawer, { DrawerInput } from 'components/Drawer';
import { inject, observer } from 'mobx-react';
import { NavigationMain, NavigationHeader, NavigationContainer, NavigationButton } from 'components/Navigation';
import React, { Component } from 'react';
import linkState from 'linkstate';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import MdHome from 'react-icons/lib/md/home';
import { withRouter } from 'react-router-dom';

@inject('MVCStore') @observer class SearchDrawer extends Component {
	state = {
		query: ''
	}

	onSubmit = (event) => {
		event.preventDefault();
		const { query } = this.state,
			{ history, MVCStore } = this.props;
		
		MVCStore.toggleSearchDrawer();
		history.push(`/search?q=${query}`);
	}

	render() {
		const { MVCStore } = this.props,
			{ query } = this.state;
		return (
			<Drawer
				wide
				open={MVCStore.searchDrawerOpen}
				onRequestClose={MVCStore.toggleSearchDrawer}
			>
				<NavigationMain color="#ffffff">
					<NavigationContainer>
						<NavigationHeader>
							<NavigationButton to="/" round disabled><MdHome width={24} height={24} /></NavigationButton>
						</NavigationHeader>
						<NavigationButton round onClick={MVCStore.toggleSearchDrawer}><MdArrowBack width={24} height={24} /></NavigationButton>
					</NavigationContainer>
				</NavigationMain>
				<NavigationMain color="#ffffff">
					<NavigationContainer fullWidth>
						<NavigationHeader />
						<form onSubmit={this.onSubmit} style={{ width: '100%' }}>
							<DrawerInput
								autofocus
								placeholder="Search for organisations, reports, and more..."
								value={query}
								onChange={linkState(this, 'query')}
							/>
						</form>
					</NavigationContainer>
				</NavigationMain>
			</Drawer>
		);
	}
};

export default withRouter(SearchDrawer);