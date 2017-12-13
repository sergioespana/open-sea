import React, { PureComponent } from 'react';
import Button from 'material-styled-components/Button';
import Container from 'components/Container';
import { inject } from 'mobx-react';
import linkState from 'linkstate';
import Main from 'components/Main';
import slug from 'slug';

@inject('ReportsStore') class New extends PureComponent {
	state = {
		name: 'My Report'
	}

	onSubmit = (event) => {
		event.preventDefault();
		let { ReportsStore, match: { params: { id } } } = this.props,
			{ name } = this.state;

		return ReportsStore.create(id, name);
	}

	render = () => {
		let { name } = this.state,
			{ history } = this.props,
			sluggedName = slug(name).toLowerCase(),
			disableButton = sluggedName === '' || sluggedName === 'my-report';

		return (
			<Main>
				<Container slim>
					<h1>Create report</h1>
					<form onSubmit={this.onSubmit}>
						<input type="text" value={name} onChange={linkState(this, 'name', 'target.value')} />
						<p>Your report's ID will be <strong>{ sluggedName }</strong></p>
						<Button onClick={history.goBack}>Cancel</Button>
						<Button primary raised type="submit" disabled={disableButton}>Create</Button>
					</form>
				</Container>
			</Main>
		);
	}
}

export default New;