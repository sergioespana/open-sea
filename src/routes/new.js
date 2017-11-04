import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import slug from 'slug';
import Main from '../components/Main';
import Container from '../components/Container';

class New extends Component {
	state = {
		id: '',
		name: ''
	}

	onInput = ({ target: { value } }) => this.setState({ name: value, id: slug(value, { lower: true }) });

	onSubmit = (event) => {
		event.preventDefault();
		let { id, name } = this.state,
			{ mobxStores: { OrgStore } } = this.context;
			
		OrgStore.createNew(id, name);
	}

	render = (props, { id, name }) => (
		<Main>
			<Container>
				<h3>Organisation name</h3>
				<form onSubmit={this.onSubmit}>
					<input type="text" placeholder="Name" value={name} onInput={this.onInput} style={{ display: 'block' }} required />
					<p>{ id !== '' && `Your organisation ID will be ${id}` }</p>
					<button type="submit">Create</button>
					<Link to="/">Cancel</Link>
				</form>
			</Container>
		</Main>
	);
}

export default New;