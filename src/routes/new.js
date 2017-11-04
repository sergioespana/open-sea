import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import slug from 'slug';
import Main from '../components/Main';
import Container from '../components/Container';
import Input from '../components/Input';

class New extends Component {
	state = {
		id: '',
		name: ''
	}

	onInput = ({ target: { value } }) => this.setState({ name: value, id: slug(value, { lower: true }) });

	onSubmit = (event) => {
		event.preventDefault();
		let { id, name } = this.state,
			{ mobxStores: { OrgStore },
				router: { history: { push } } } = this.context;
			
		OrgStore.createNew(id, name).then(() => push('/')).catch();
	}

	render = (props, { id, name }) => (
		<Main>
			<Container slim>
				<form onSubmit={this.onSubmit}>
					<Input
						fullWidth
						type="text"
						label="Organisation name"
						help={id !== '' ? `Your organisation ID will be ${id}` : null}
						value={name}
						onInput={this.onInput}
					/>
					<br />
					<br />
					<button type="submit">Create</button>
					<Link to="/">Cancel</Link>
				</form>
			</Container>
		</Main>
	);
}

export default New;