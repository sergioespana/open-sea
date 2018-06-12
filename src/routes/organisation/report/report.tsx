import { findLast, get, isEmpty, isUndefined, map } from 'lodash';
import { toJS } from 'mobx';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import MdMoreHoriz from 'react-icons/lib/md/more-horiz';
import { withRouter } from 'react-router-dom';
import { Button, LinkButton } from '../../../components/Button';
import Chart from '../../../components/Chart';
import Container from '../../../components/Container';
import EmptyState from '../../../components/EmptyState';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { Menu, MenuOption } from '../../../components/Menu';
import Modal, { ModalFooter, ModalHeader, ModalSection } from '../../../components/Modal';
import { LinkInput } from '../../../components/NewInput';
import { ReportGrid, ReportGridItem } from '../../../components/ReportGrid';
import { Section } from '../../../components/Section';
import collection from '../../../stores/collection';

interface State {
	showModal: boolean;
}

@inject(app('OrganisationsStore', 'ReportsStore', 'UIStore'))
@observer
class OrganisationReportOverview extends Component<any, State> {
	state: State = {
		showModal: false
	};

	render () {
		const { match: { params: { orgId, repId } }, OrganisationsStore, ReportsStore } = this.props;
		const { showModal } = this.state;
		const organisation = OrganisationsStore.findById(orgId);
		const parentNetwork = OrganisationsStore.findParentNetworkById(orgId);
		const report = collection(organisation._reports).findById(`${orgId}/${repId}`);
		const model = get(parentNetwork || report, 'model');
		const data = get(report, 'data');

		const PageHead = (
			<Header
				title={report.name}
				headTitle={`${organisation.name} / ${report.name}`}
				breadcrumbs={[
					<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
					<Link key={`/${orgId}/reports`} to={`/${orgId}/reports`}>Reports</Link>
				]}
			>
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

		// TODO: If this is part of an organisation, show a different error.
		if (isEmpty(model)) {
			const recentModel = get(findLast(organisation._reports, 'model'), 'model');

			return (
				<React.Fragment>
					{PageHead}
					<Container>
						<EmptyState>
							<img src="/assets/images/empty-state-no-model.svg" />
							<h1>Let's get started</h1>
							{ !isUndefined(recentModel) ? (
								<p>
									To begin, <LinkInput accept=".yml" onChange={this.onFileChange}>add a new model</LinkInput> to this report or
									 <a onClick={this.copyModel(recentModel)}>use the previous report's</a>. To learn more, <a>click here</a>.
								</p>
							) : (
								<p>
									To begin, <LinkInput accept=".yml" onChange={this.onFileChange}>add a model</LinkInput> to this report. To learn more,
									<a>click here</a>.
								</p>
							) }
						</EmptyState>
					</Container>
					<Modal isOpen={showModal}>
						<ModalHeader>
							<h1>Validating model</h1>
						</ModalHeader>
						<ModalSection>
							openSEA is validating and saving the model you've selected. This shouldn't take long.
						</ModalSection>
						<ModalFooter />
					</Modal>
				</React.Fragment>
			);
		}

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

		const items = get(model, 'reportItems');

		if (isEmpty(items)) return (
			<React.Fragment>
				{PageHead}
				<Container>
					<EmptyState>
						<img src="/assets/images/empty-state-no-data.svg" />
						<h1>No report items</h1>
						<p>
							The model for this report contains no report items. <LinkInput>Upload a new
							model</LinkInput> to get started. <a>Click here</a> for more information.
						</p>
					</EmptyState>
				</Container>
			</React.Fragment>
		);

		return (
			<React.Fragment>
				{PageHead}
				<Container>
					<Section maxWidth={700}>
						<ReportGrid>
							{map(items, (item) => {
								// Show chart if the chart object is set. Prefer chart
								// over 'value' key.
								if (item.chart) {
									// We overwrite the user's chart type setting because pie charts
									// are currently broken.
									const chart = {
										type: item.chart.type === 'pie' ? 'percentage' : item.chart.type,
										data: {
											labels: map(item.chart.data, (indId) => model.indicators[indId].name),
											datasets: [{
												values: map(item.chart.data, (indId) => ReportsStore.compute(model.indicators[indId].value, data))
											}]
										}
									};

									return (
										<ReportGridItem>
											<h2>{item.name}</h2>
											<Chart {...chart} />
										</ReportGridItem>
									);
								}
								// Only show a single value.
								if (item.value) return (
									<ReportGridItem>
										<h3>{item.name}</h3>
										<p>
											{ReportsStore.compute(model.indicators[item.value].value, data)}
											{model.indicators[item.value].type === 'percentage' && '%'}
										</p>
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
	}

	private onFileChange = (event) => {
		this.setState({ showModal: true });
		const file = event.target.files[0];
		const fr = new FileReader();
		fr.onload = this.onFileLoad;
		fr.readAsText(file);
	}
	private onFileLoad = (ev: ProgressEvent) => {
		const { srcElement }: { srcElement: Partial<FileReader> } = ev;
		const { result } = srcElement;
		const { ReportsStore, UIStore } = this.props;

		if (!result) {
			UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'Could not read the selected file.' });
			this.setState({ showModal: false });
			return;
		}

		const json = ReportsStore.parseStrToJson(result);
		return this.validateAndStoreModel(json);
	}
	private validateAndStoreModel = (json) => {
		const { history, match: { params: { orgId, repId } }, ReportsStore, UIStore } = this.props;
		const { accepted } = ReportsStore.validateModel(json);

		if (!accepted) {
			// TODO: Show first error in errors object in flag description.
			UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'Your model contained errors.' });
			this.setState({ showModal: false });
		} else {
			const model = { ...accepted, _orgId: orgId, _repId: repId };

			const onSuccess = () => {
				UIStore.addFlag({ appearance: 'success', title: 'Model saved successfully' });
				history.push(`/${orgId}/${repId}/data`);
			};
			const onError = () => {
				this.setState({ showModal: false });
				UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'There was an error storing your model. Please try again.' });
			};

			return ReportsStore.addModel(model, { onSuccess, onError });
		}
	}
	private copyModel = (model) => () => this.validateAndStoreModel(toJS(model));
}

export default withRouter(OrganisationReportOverview);
