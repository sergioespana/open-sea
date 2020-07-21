import linkState from 'linkstate';
import { filter, get, isUndefined, last, map, partition } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Lozenge from '../../components/Lozenge';
import { Section } from '../../components/Section';
import Select from '../../components/Select';
import { Certification, Organisation, Requirement } from '../../domain/Organisation';
import collection from '../../stores/collection';

interface State {
	baseReport: string;
}

@inject(app('OrganisationsStore', 'ReportsStore'))
@observer
class OrganisationCertification extends Component<any, State> {
	readonly state: State = {
		baseReport: ''
	};

	componentWillMount () {
		const { match: { params: { orgId } }, OrganisationsStore } = this.props;
		const organisation: Organisation = OrganisationsStore.findById(orgId) || {};
		const withData = filter(organisation._reports, 'data');
		this.setState({ baseReport: last(withData)._id });
	}

	render () {
		const { match: { params: { orgId } }, OrganisationsStore, ReportsStore } = this.props;
		const { baseReport } = this.state;
		const organisation: Organisation = OrganisationsStore.findById(orgId) || {};
		const network: Organisation = OrganisationsStore.findParentNetworkById(orgId);
		const report = collection(organisation._reports).findById(baseReport);
		const model = get(network, 'model');
		const certifications: Certification[] = get(model, 'certifications');

		const PageHead = (
			<Header
				title="Certification"
				headTitle={`${organisation.name} / Certification`}
				breadcrumbs={[
					<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>
				]}
			>
				<Select
					isCompact
					onChange={linkState(this, 'baseReport', 'value')}
					options={map(organisation._reports, ({ _id, name }) => ({ value: _id, label: name }))}
					placeholder="Choose report"
					value={baseReport}
				/>
			</Header>
		);

		if (!certifications) return <Redirect to={`/${orgId}`} />;

		const assessed: Certification[] = ReportsStore.assess(certifications, model.indirectIndicators, report);
		const { current: currentIndex, next: nextIndex } = ReportsStore.getCertificationIndex(assessed);
		const current = assessed[currentIndex];
		const next = assessed[nextIndex];

		const CurrentCertification = (
			<div>
				<h3>Current level</h3>
				<p>
					{isUndefined(current)
						? <span>None</span>
						: <Lozenge appearance="default" bg={current.colour}>{current.name}</Lozenge>}
				</p>
			</div>
		);

		if (isUndefined(next)) return (
			<React.Fragment>
				{PageHead}
				<Container>
					<Section>
						{CurrentCertification}
					</Section>
				</Container>
			</React.Fragment>
		);

		const [unmet, met] = partition(next.requirements, { _pass: false });

		return (
			<React.Fragment>
				{PageHead}
				<Container>
					<Section>
						{CurrentCertification}
						<div>
							<h3>Next level</h3>
							<p>
								<Lozenge appearance="default" bg={next.colour}>{next.name}</Lozenge>
							</p>
							<h3>Requirements already met</h3>
							<ul>
								{map(met, (requirement: Requirement) => {
									const { _computed, indicator, operator, value } = requirement;
									return (
										<li>
											<strong>{get(network, `model.indirectIndicators.${indicator}.name`)}</strong> ({indicator}) should be {ReportsStore.operatorText[operator]}
											&nbsp;{value}{operator !== '==' ? `. It currently has a value of ${_computed}.` : ', which it is.'}
										</li>
									);
								})}
							</ul>
							<h3>Requirements to meet</h3>
							<ul>
								{map(unmet, (requirement: Requirement) => {
									const { _computed, indicator, operator, value } = requirement;
									return (
										<li>
											<strong>{get(network, `model.indirectIndicators.${indicator}.name`)}</strong> ({indicator})
										should be {ReportsStore.operatorText[operator]} {value}, however it is currently at {_computed}.
									</li>
									);
								})}
							</ul>
						</div>
					</Section>
				</Container>
			</React.Fragment>
		);
	}
}

export default OrganisationCertification;
