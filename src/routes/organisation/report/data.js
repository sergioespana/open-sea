import Form, { Alert, Input } from 'components/Form';
import Header, { Breadcrumbs, Section } from 'components/Header';
import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Container from 'components/Container';
import Helmet from 'react-helmet';
import isEqual from 'lodash/isEqual';
import { Link } from 'components/Link';
import map from 'lodash/map';
import { withRouter } from 'react-router-dom';

@inject(app('OrganisationsStore', 'ReportsStore', 'VisualStore'))
@observer
class OrganisationReportData extends Component {
	state = {
		error: ''
	}

	onSubmit = async (event) => {
		const { history, match: { params: { orgId, repId } }, ReportsStore, VisualStore } = this.props;
		const report = ReportsStore.getItem(`${orgId}/${repId}`, '_id');
		const data = report._data || {};

		event.preventDefault();
		this.setState({ error: null });
		VisualStore.setBusy(true);

		const { code } = ReportsStore.saveData(orgId, repId, data);
		VisualStore.setBusy(false);
		if (code) this.handleError(code);
		else history.push(`/${orgId}/${repId}`);
	}

	handleError = (code) => {
		switch (code) {
			default: return this.setState({ error: 'An unknown error has occurred' });
		}
	}

	componentWillUnmount = () => {
		const { match: { params: { orgId, repId } }, ReportsStore } = this.props;
		const report = ReportsStore.getItem(`${orgId}/${repId}`, '_id');
		ReportsStore.updateItem({ ...report, _data: report.data || {} }, '_id');
	}

	render = () => {
		const { match: { params: { orgId, repId } }, OrganisationsStore, ReportsStore, state } = this.props;
		const { busy } = state;
		const { error } = this.state;
		const organisation = OrganisationsStore.getItem(orgId, '_id');
		const report = ReportsStore.getItem(`${orgId}/${repId}`, '_id');
		const data = report._data;
		const model = report.model || {};
		const metrics = model.metrics || {};

		return (
			<Fragment>
				<Helmet title={`${organisation.name} / ${report.name} / Data`} />
				<Header>
					<Section>
						<Breadcrumbs>
							<Link to={`/${orgId}`}>{ organisation.name }</Link>
							<Link to={`/${orgId}/reports`}>Reports</Link>
							<Link to={`/${orgId}/${repId}`}>{ report.name }</Link>
						</Breadcrumbs>
						<h1>Data</h1>
					</Section>
				</Header>
				<Container>
					<Form onSubmit={this.onSubmit}>
						<section>
							<Alert type="error" message={error} />
							{ map(metrics, ({ help, name, type }, metId) => (
								<Input
									key={metId}
									type={type}
									label={name}
									help={help}
									value={data[metId] || ''}
									onChange={ReportsStore.linkData(orgId, repId, metId)}
									disabled={busy}
								/>
							)) }
						</section>
						<footer>
							<Button cta color="#ffffff" type="submit" disabled={busy || isEqual(report.data, report._data)}>Save changes</Button>
							<Link to={`/${orgId}/${repId}`}>Cancel</Link>
						</footer>
					</Form>
				</Container>
			</Fragment>
		);
	}
}

export default withRouter(OrganisationReportData);