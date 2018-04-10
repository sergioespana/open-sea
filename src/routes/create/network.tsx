import React from 'react';
import Helmet from 'react-helmet';
import Button from '../../components/Button';
import Form from '../../components/Form';
import Input, { TextArea } from '../../components/NewInput';

const CreateNetwork = () => {

	return (
		<React.Fragment>
			<Helmet title="Create a network" />
			<Form>
				<header>
					<h1>Create a network</h1>
				</header>
				<Input
					appearance="default"
					isCompact
					label="Name"
					required
					type="text"
				/>
				<Input
					appearance="default"
					isCompact
					label="URL"
					required
					prefix={`${window.location.hostname}/`}
					type="text"
				/>
				<TextArea
					appearance="default"
					isCompact
					label="Description"
					required
				/>
				<Input
					appearance="default"
					help="Public networks and their reports are visible to anyone. Explicitly granted access is still required for certain operations."
					isCompact
					label="Public"
					placeholder="This is a public network"
					required
					type="checkbox"
				/>
				<footer>
					<Button appearance="default">Create network</Button>
					<Button appearance="link">Cancel</Button>
				</footer>
			</Form>
		</React.Fragment>
	);
};

export default CreateNetwork;
