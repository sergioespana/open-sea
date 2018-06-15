import { safeDump } from 'js-yaml';
import { get, isEmpty } from 'lodash';
import { toJS } from 'mobx';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import MdFileDownload from 'react-icons/lib/md/file-download';
import Button from '../../../components/Button';
import Container from '../../../components/Container';
import EmptyState from '../../../components/EmptyState';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { Section } from '../../../components/Section';
import collection from '../../../stores/collection';

@inject(app('OrganisationsStore', 'ReportsStore', 'UIStore'))
@observer
class OrganisationsReportModel extends Component<any> {
	input = null;

	render () {
		const { match: { params: { orgId, repId } }, OrganisationsStore } = this.props;
		const organisation = OrganisationsStore.findById(orgId);
		const parentNetwork = OrganisationsStore.findParentNetworkById(orgId);
		const report = repId ? collection(organisation._reports).findById(`${orgId}/${repId}`) : null;
		const model = get(report || organisation, 'model');

		const title = repId ? `Model - ${organisation.name} / ${report.name}` : `Model - ${organisation.name} / Settings`;
		const breadcrumbs = repId ? [
			<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
			<Link key={`/${orgId}/reports`} to={`/${orgId}/reports`}>Reports</Link>,
			<Link key={`/${orgId}/${repId}`} to={`/${orgId}/${repId}`}>{report.name}</Link>
		] : [
			<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
			<Link key={`/${orgId}/settings`} to={`/${orgId}/settings`}>Settings</Link>
		];
		const PageHead = (
			<Header
				title="Model"
				headTitle={title}
				breadcrumbs={breadcrumbs}
			>
				{!isEmpty(model) && <Button appearance="light" onClick={this.exportModel(orgId, model)}><MdFileDownload height={20} width={20} /></Button>}
				{!isEmpty(model) && <Button appearance="light" onClick={this.openInput}>Upload new</Button>}
			</Header>
		);
		const ModelInput = (
			<input
				accept=".yml"
				onChange={this.onFileChange}
				ref={this.getRef}
				style={{ display: 'none' }}
				type="file"
			/>
		);

		if (isEmpty(model)) return (
			<React.Fragment>
				{PageHead}
				{ModelInput}
				<Container>
					<EmptyState>
						<img src="/assets/images/empty-state-no-model.svg" />
						<h1>Let's get started</h1>
						{parentNetwork ? (
							<p>
								Since your organisation belongs to a network, the model that you upload will be merged
								with the network's if it is set. You may also use the network's directly. Learn more
								about openSEA models <a>here</a>.
							</p>
						) : (
							<p>
								The interface around this report is derived from a model which this report lacks.
								Learn more about openSEA models <a>here</a>.
							</p>
						)}
						<p>
							<Button appearance="default" onClick={this.openInput}>Upload model</Button>
							{(parentNetwork && get(parentNetwork, 'model')) && <Button appearance="link" onClick={this.copyModel}>Use network's</Button>}
						</p>
					</EmptyState>
				</Container>
			</React.Fragment>
		);

		return (
			<React.Fragment>
				{PageHead}
				{ModelInput}
				<Container>
					<Section>
						<p style={{ marginTop: 0 }}>
							Changing the model below does <strong>not</strong> modify any data, so changing metric<br />
							and indicator identifiers between models may result in the wrong data<br />
							being referenced.
						</p>
						<p>
							openSEA does <strong>not</strong> yet hold on to previous versions of models, so make<br />
							sure you keep a backup yourself.
						</p>
						<h3>Current model</h3>
						<pre>{JSON.stringify(model, null, 2)}</pre>
					</Section>
				</Container>
			</React.Fragment>
		);
	}

	private getRef = (node) => this.input = node;
	private openInput = () => this.input.click();
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
		const { match: { params: { orgId, repId } }, OrganisationsStore, ReportsStore, UIStore } = this.props;
		const { accepted, errors } = ReportsStore.validateModel(json);

		if (!accepted) {
			// TODO: Show first error in errors object in flag description.
			errors.forEach(console.log);
			UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'Your model contained errors.' });
		} else {
			const parentNetwork = OrganisationsStore.findParentNetworkById(orgId);
			const model = parentNetwork
				? { ...get(parentNetwork, 'model'), ...accepted, _orgId: orgId, _repId: repId }
				: { ...accepted, _orgId: orgId, _repId: repId };

			const onSuccess = () => {
				UIStore.addFlag({ appearance: 'success', title: 'Model saved successfully' });
			};
			const onError = () => {
				UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'There was an error storing your model. Please try again.' });
			};

			return ReportsStore.addModel(model, { onSuccess, onError });
		}
	}
	private copyModel = () => {
		const { match: { params: { orgId } }, OrganisationsStore } = this.props;
		const network = OrganisationsStore.findParentNetworkById(orgId);
		const model = toJS(get(network, 'model'));
		return this.validateAndStoreModel(model);
	}
	private exportModel = (orgId, json) => () => {
		const yaml = safeDump(json);
		const blob = new Blob([yaml], {
			type: 'text/plain;charset=utf-8'
		});
		const url = window.URL.createObjectURL(blob);

		let a = document.createElement('a');
		a.setAttribute('hidden', 'true');
		a.setAttribute('href', url);
		a.setAttribute('download', `${orgId}.yml`);

		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
	}
}

export default OrganisationsReportModel;
