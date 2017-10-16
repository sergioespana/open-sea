import { h } from 'preact';
import { Redirect } from 'react-router-dom';

const Setup = (props, { services: { MVCService } }) => {
	if (MVCService.loading) return (
		<div id="main">
			<h1>Loading...</h1>
		</div>
	);

	if (MVCService.model && !MVCService.errors) return (
		<Redirect to="/" />
	);

	return (
		<div id="main">
			<input type="file" accept=".yml" onChange={MVCService.parseFile} />
			{ MVCService.errors && (
				<ul>
					{ MVCService.errors.map((error) => (
						<li>{ error.dataPath } { error.message }</li>
					)) }
				</ul>
			)}
		</div>
	);
};

export default Setup;