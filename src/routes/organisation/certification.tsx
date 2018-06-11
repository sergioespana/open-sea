import { filter, get, isNumber, isUndefined, last, map, partition } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Lozenge from '../../components/Lozenge';
import { Section } from '../../components/Section';
import { Certification, Organisation, Requirement } from '../../domain/Organisation';

const OrganisationCertification = inject(app('OrganisationsStore', 'ReportsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore, ReportsStore } = props;
	const organisation: Organisation = OrganisationsStore.findById(orgId) || {};
	const network: Organisation = OrganisationsStore.findParentNetworkById(orgId);
	const model = get(network, 'model');

	const PageHead = (
		<Header
			title="Certification"
			headTitle={`${organisation.name} / Certification`}
			breadcrumbs={[
				<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>
			]}
		/>
	);

	// TODO: Show empty state.
	if (!model) return null;

	const certifications: Certification[] = get(model, 'certifications');

	// TODO: Show empty state.
	if (!certifications) return null;

	const withData = filter(organisation._reports, 'data');
	const report = last(withData);
	const assessed: Certification[] = ReportsStore.assess(certifications, model.indicators, report);
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
										<strong>{get(network, `model.indicators.${indicator}.name`)}</strong> ({indicator}) should be {ReportsStore.operatorText[operator]}
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
										<strong>{get(network, `model.indicators.${indicator}.name`)}</strong> ({indicator})
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
}));

export default OrganisationCertification;
