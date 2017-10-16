import { h } from 'preact';
import { Redirect } from 'react-router-dom';

const Dashboard = (props, { services: { MVCService } }) => {
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
			{ Object.keys(MVCService.model.indicators).map((id) => {
				let indicator = MVCService.model.indicators[id];
				return (
					<div>
						<h3>{ indicator.name }</h3>
						<p>{ indicator.help }</p>
						<h1>{ MVCService.safeEval(id) }</h1>
					</div>
				)
			}) }
		</div>
	);
};

export default Dashboard;