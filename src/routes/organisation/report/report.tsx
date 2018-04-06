import { filter, get, isEmpty, map } from 'lodash';
import { app, collection } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import MdMoreHoriz from 'react-icons/lib/md/more-horiz';
import { Button, LinkButton } from '../../../components/Button';
import Container from '../../../components/Container';
import EmptyState from '../../../components/EmptyState';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { Menu, MenuOption } from '../../../components/Menu';
import { ReportGrid, ReportGridItem } from '../../../components/ReportGrid';
import { Section } from '../../../components/Section';

const OrganisationReportOverview = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId, repId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');
	const report = collection(organisation._reports).getItem(`${orgId}/${repId}`, '_id');
	const model = get(report, 'model');
	const data = get(report, 'data');
	const items = get(report, 'model.reportItems');

	const PageHead = (
		<Header
			title={report.name}
			headTitle={`${organisation.name} / ${report.name}`}
			breadcrumbs={[
				<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
				<Link key={`/${orgId}/reports`} to={`/${orgId}/reports`}>Reports</Link>
			]}
		>
			{!isEmpty(data) && <LinkButton appearance="light" to={`/${orgId}/${repId}/data`}>Edit data</LinkButton>}
			{!isEmpty(data) && <Button appearance="light">Export</Button>}
			<Menu
				trigger={<Button appearance="light"><MdMoreHoriz height={24} width={24} /></Button>}
				position="bottom-left"
			>
				{!isEmpty(data) && <MenuOption>Share report</MenuOption>}
				<MenuOption>Delete report</MenuOption>
			</Menu>
		</Header>
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

	if (isEmpty(data)) return (
		<React.Fragment>
			{PageHead}
			<Container>
				<EmptyState>
					<img src="/assets/images/empty-state-no-data.svg" />
					<h1>Add some data</h1>
					<p>
						To generate a report, some data is required.
					</p>
					<p>
						<LinkButton appearance="default" to={`/${orgId}/${repId}/data`}>Add data</LinkButton>
					</p>
				</EmptyState>
			</Container>
		</React.Fragment>
	);

	if (isEmpty(items)) return (
		<React.Fragment>
			{PageHead}
			<Container>
				<EmptyState>
					<img src="/assets/images/empty-state-no-data.svg" />
					<h1>No reportitems</h1>
					<p>
						The model for this report contains no report items.
						Upload a new model to get started. <a>Click here</a> for
						more information.
					</p>
				</EmptyState>
			</Container>
		</React.Fragment>
	);

	return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Section>
					<ReportGrid>
						{map(items, (item) => {
							const { chart, name, value } = item;
							// Show chart if the chart object is set. Prefer chart
							// over 'value' key.
							if (chart) {
								const { data, type } = chart;
								const values = filter(model.indicators, (...args) => data.includes(args[1]));
								return (
									<ReportGridItem>
										<h3>{name}</h3>
										<p>{JSON.stringify(chart)}</p>
										<p>{JSON.stringify({ data: values, type })}</p>
									</ReportGridItem>
								);
							}
							// Only show a single value.
							if (value) return (
								<ReportGridItem>
									<h3>{name}</h3>
									<p>{value}</p>
								</ReportGridItem>
							);
							// No value or chart specified, don't show the item.
							return null;
						})}
					</ReportGrid>
				</Section>
			</Container>
		</React.Fragment>
	);
}));

export default OrganisationReportOverview;
