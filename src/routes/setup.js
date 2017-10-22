import { h } from 'preact';
import { Redirect } from 'react-router-dom';
import Container from '../components/Container';
import Snackbar from '../components/Snackbar';

const Setup = (props, { services: { MVCService, SnackService } }) => {
	if (MVCService.loading) return;

	if (MVCService.model && !MVCService.errors) return (
		<Redirect to="/input" />
	);

	return (
		<div id="main">
			<Container slim>
				<input type="file" accept=".yml" onChange={MVCService.parseFile} />
				<Snackbar
					message={MVCService.errors[0].message}
					autoHideDuration={3000}
				/>
			</Container>
		</div>
	);
};

export default Setup;