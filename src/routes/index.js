import { h } from 'preact';
import { Redirect } from 'react-router-dom';
import Container from '../components/Container';
import Indicator from '../components/Indicator';

const Dashboard = (props, { services: { MVCService, SnackService } }) => {
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
			<Container>
				{ Object.keys(MVCService.model.indicators).map((id) => (
					<Indicator
						id={id}
						indicator={MVCService.model.indicators[id]}
					/>
				)) }
			</Container>
		</div>
	);
};

export default Dashboard;