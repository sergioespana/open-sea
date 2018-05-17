import { filter, get, isNumber, isUndefined, map } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Lozenge from '../../components/Lozenge';
import { Section } from '../../components/Section';

const OrganisationCertification = inject(app('OrganisationsStore', 'ReportsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore, ReportsStore } = props;
	const organisation = OrganisationsStore.findById(orgId) || {};
	const parentNetwork = OrganisationsStore.findParentNetworkById(orgId);
	const assessed = ReportsStore.assess(parentNetwork, organisation);
	const certification = ReportsStore.getCertification(parentNetwork, assessed);
	const nextCertification = get(parentNetwork, `model.certifications[${certification._index + 1 || 0}]`);
	const unmetRequirements = filter(get(assessed, `[${certification._index + 1 || 0}].requirements`), { pass: false });

	const PageHead = (
		<Header
			title="Certification"
			headTitle={`${organisation.name} / Certification`}
			breadcrumbs={[
				<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>
			]}
		/>
	);

	// TODO: Catch cases in which no model or reports exist

	return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Section>
					<div>
						<h3>Current level:</h3>
						<p>
							{isNumber(certification)
								? <span>None</span>
								: <Lozenge appearance="default" bg={certification.colour}>{certification.name}</Lozenge>}
						</p>
					</div>
					{!isUndefined(nextCertification) && <div>
						<h3>Next level:</h3>
						<p>
							<Lozenge appearance="default" bg={nextCertification.colour}>{nextCertification.name}</Lozenge>
						</p>
						<h3>Unmet requirements ({unmetRequirements.length}/{nextCertification.requirements.length})</h3>
						<p>
							<ul>
								{map(unmetRequirements, ({ computed, indicator, operator, value }) => (
									<li>
										<strong>{get(parentNetwork, `model.indicators.${indicator}.name`)}</strong> ({indicator})
										should be <strong>{operator}{value}</strong>, current value is <strong>{computed}</strong>.
									</li>
								))}
							</ul>
						</p>
					</div>}
				</Section>
			</Container>
		</React.Fragment>
	);
}));

export default OrganisationCertification;
