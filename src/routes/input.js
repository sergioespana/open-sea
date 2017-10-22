import { h } from 'preact';
import { Redirect } from 'react-router-dom';
import Container from '../components/Container';
import InputField from '../components/InputField';
import List from 'material-ui/List';

const Input = (props, { services: { MVCService } }) => {
	if (MVCService.loading) return (
		<div id="main">
			<h1>Loading...</h1>
		</div>
	);

	if (MVCService.errors && !MVCService.model) return (
		<Redirect to="/setup" />
	);

	return (
		<div id="main">
			<Container slim>
				<List>
					{ Object.keys(MVCService.model.metrics).map((id) => {
						let metric = MVCService.model.metrics[id];
						return (
							<InputField
								id={id}
								metric={metric}
							/>
						);
					}) }
				</List>
			</Container>
		</div>
	);
};

export default Input;