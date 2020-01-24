import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { Section } from '../../components/Section';
import { Organisation } from '../../domain/Organisation';

interface State {
	baseReport: string;
}

@inject(app('OrganisationsStore'))
@observer
class OrganisationSurveys extends Component<any, State> {
	render () {
		const { match: { params: { orgId } }, OrganisationsStore } = this.props;
		const organisation: Organisation = OrganisationsStore.findById(orgId) || {};

		const PageHead = (
			<Header
				title="Survey Overview"
				headTitle={`${organisation.name} / Survey Overview`}
				breadcrumbs={[
					<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>
				]}
			/>
		);

		const CurrentCertification = (
			<div>
				<h3>Survey Results or Settings</h3>
				<p>
					An overview will be given here, in table output, showing survey responserates for example. 
				</p>
			</div>
		);


		return (
			<React.Fragment>
				{PageHead}
				<Container>
					<Section>
						{CurrentCertification}
					</Section>
				</Container>
			</React.Fragment>
		);
	}
}

export default OrganisationSurveys;
