import React from 'react';
import Helmet from 'react-helmet';
import Button from '../../components/Button';
import Form from '../../components/Form';
import Input, { TextArea } from '../../components/NewInput';

const CreateOrganisation = () => {

	return (
		<React.Fragment>
			<Helmet title="Create an organisation" />
			<Form>
				<header>
					<h1>Create an organisation</h1>
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
					help="Public organisations and their reports are visible to anyone. Explicitly granted access is still required for certain operations."
					isCompact
					label="Public"
					placeholder="This is a public organisation"
					required
					type="checkbox"
				/>
				<footer>
					<Button appearance="default">Create organisation</Button>
					<Button appearance="link">Cancel</Button>
				</footer>
			</Form>
		</React.Fragment>
	);
};

export default CreateOrganisation;
