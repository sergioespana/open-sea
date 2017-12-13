import React, { PureComponent } from 'react';
import Button from 'material-styled-components/Button';
import Container from '../components/Container';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import linkState from 'linkstate';
import Main from '../components/Main';
import slug from 'slug';

@inject('OrganisationsStore') class New extends PureComponent {
	state = {
		name: 'My Organisation'
	}

	onSubmit = (event) => {
		event.preventDefault();
		let { OrganisationsStore } = this.props,
			{ name } = this.state;

		return OrganisationsStore.create(name);
	}

	render = () => {
		let { name } = this.state,
			sluggedName = slug(name).toLowerCase(),
			disableButton = sluggedName === '' || sluggedName === 'my-organisation';

		return (
			<Main>
				<Container slim>
					<h1>Create organisation</h1>
					<form onSubmit={this.onSubmit}>
						<input type="text" value={name} onChange={linkState(this, 'name', 'target.value')} />
						<p>Your organisation's ID will be <strong>{ sluggedName }</strong></p>
						<Link to="/"><Button>Cancel</Button></Link>
						<Button primary raised type="submit" disabled={disableButton}>Create</Button>
					</form>
				</Container>
			</Main>
		);
	}
}

export default New;