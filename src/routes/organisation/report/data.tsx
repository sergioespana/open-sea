import { filter, get, isEmpty, map } from 'lodash';
import { app, collection } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Button, LinkButton } from '../../../components/Button';
import Container from '../../../components/Container';
import EmptyState from '../../../components/EmptyState';
import Form, { FormActions } from '../../../components/Form';
import Header from '../../../components/Header';
import { TextField } from '../../../components/Input';
import { Link } from '../../../components/Link';
import { Redirect } from '../../../components/Redirect';

const OrganisationReportData = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId, repId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');
	const report = collection(organisation._reports).getItem(`${orgId}/${repId}`, '_id');

	if (!report) return <Redirect to={`/${orgId}/reports`} />;

	const data = get(report, 'data');
	const model = get(report, 'model');
	const categories = get(model, 'categories');
	const PageHead = (
		<Header
			title="Data"
			headTitle={`${organisation.name} / ${report.name} / Data`}
			breadcrumbs={[
				<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
				<Link key={`/${orgId}/reports`} to={`/${orgId}/reports`}>Reports</Link>,
				<Link key={`/${orgId}/${repId}`} to={`/${orgId}/${repId}`}>{report.name}</Link>
			]}
		/>
	);

	if (isEmpty(model)) return (
		<React.Fragment>
			{PageHead}
			<Container>
				<EmptyState>
					<img src="/assets/images/empty-state-no-model.svg" />
					<h1>Let's get started</h1>
					<p>
						To begin, add a model to this report. Drop one on the screen or
						<a>click here</a>.
					</p>
				</EmptyState>
			</Container>
		</React.Fragment>
	);

	return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Form>
					{isEmpty(categories)
						? renderFields(model.metrics, data)
						: map(categories, (category) => (
							<React.Fragment>
								<h3>{category}</h3>
								{renderFields(filter(model.metrics, { category }), data)}
							</React.Fragment>
						))
					}
					<FormActions>
						<Button appearance="default" type="submit">Save data</Button>
						<LinkButton appearance="link" to={`/${orgId}/${repId}`}>Cancel</LinkButton>
					</FormActions>
				</Form>
			</Container>
		</React.Fragment>
	);
}));

const renderFields = (items, data) => map(items, ({ name, ...rest }, key) => (
	<TextField
		compact
		label={name}
		multiple={rest.type === 'text'}
		value={get(data, key)}
		{...rest}
	/>
));

export default OrganisationReportData;
