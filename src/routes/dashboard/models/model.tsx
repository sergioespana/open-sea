import { safeDump } from 'js-yaml';
import { find, omit } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import Button from '../../../components/Button';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Section } from '../../../components/Section';

const DashboardModelsModel = inject(app('state'))(observer((props) => {
	const { match: { params: { modelId } }, state } = props;
	const { models } = state;
	const model = omit(find(models, { _id: modelId }), '_id');

	return (
		<React.Fragment>
			<Header
				title="Models"
				headTitle="dashboard / models"
			/>
			<Container>
				<Section>
					<Button appearance="default" onClick={exportModel(model)}>Get YAML file</Button>
					<pre>{JSON.stringify(model, null, 2)}</pre>
				</Section>
			</Container>
		</React.Fragment>
	);
}));

const exportModel = (json) => () => {
	const yaml = safeDump(json);
	const blob = new Blob([yaml], {
		type: 'text/plain;charset=utf-8'
	});
	const url = window.URL.createObjectURL(blob);

	let a = document.createElement('a');
	a.setAttribute('hidden', 'true');
	a.setAttribute('href', url);
	a.setAttribute('download', `${json.name}.yml`);

	document.body.appendChild(a);
	a.click();
	window.URL.revokeObjectURL(url);
};

export default DashboardModelsModel;
