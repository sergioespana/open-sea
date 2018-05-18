import { get } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Button from '../../../components/Button';
import Container from '../../../components/Container';
import EmptyState from '../../../components/EmptyState';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { LinkInput } from '../../../components/NewInput';
import { Section } from '../../../components/Section';

@inject(app('OrganisationsStore', 'ReportsStore', 'UIStore'))
@observer
class NetworkSettingsModel extends Component<any> {

	private input = null;

	render () {
		const { match: { params: { netId } }, OrganisationsStore } = this.props;
		const network = OrganisationsStore.findById(netId);
		const model = get(network, 'model');

		const PageHead = (
			<Header
				title="Model"
				headTitle={`Model - ${network.name} / Settings`}
				breadcrumbs={[
					<Link key={`/${netId}`} to={`/${netId}`}>{network.name}</Link>,
					<Link key={`/${netId}/settings`} to={`/${netId}/settings`}>Settings</Link>
				]}
			/>
		);

		if (!model) return (
			<React.Fragment>
				{PageHead}
				<Container>
					<Section>
						<EmptyState>
							<img src="/assets/images/empty-state-welcome.svg" />
							<h1>Welcome to openSEA networks</h1>
							<p>
								To get started using openSEA for your network, a model is required. This model
								will be used for all reports created by organisations in your network.
							</p>
							<p><Button appearance="default" onClick={this.onClick} type="button">Add a model</Button></p>
							<input
								accept=".yml"
								onChange={this.onFileChange}
								ref={this.setRef}
								style={{ display: 'none' }}
								type="file"
							/>
						</EmptyState>
					</Section>
				</Container>
			</React.Fragment>
		);

		return (
			<React.Fragment>
				{PageHead}
				<Container>
					<Section>
						<EmptyState>
							<img src="/assets/images/empty-state-development.svg" />
							<h1>This page is in development</h1>
							<p>
								Your network already has a model. In a later version, you will be able to visualise and
								change the model right here on this page, however for now you may
								only <LinkInput accept=".yml" onChange={this.onFileChange}>upload a new model</LinkInput>.
							</p>
						</EmptyState>
					</Section>
				</Container>
			</React.Fragment>
		);
	}

	private setRef = (elem) => this.input = elem;
	private onClick = () => this.input.click();
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
		const { history, match: { params: { netId } }, ReportsStore, UIStore } = this.props;
		const { accepted, errors } = ReportsStore.validateModel(json);

		if (!accepted) {
			// TODO: Show first error in errors object in flag description.
			errors.forEach(console.log);
			UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'Your model contained errors.' });
			this.setState({ showModal: false });
		} else {
			const model = { ...accepted, _orgId: netId };

			const onSuccess = () => {
				UIStore.addFlag({ appearance: 'success', title: 'Model saved successfully' });
				history.push(`/${netId}`);
			};
			const onError = () => {
				this.setState({ showModal: false });
				UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'There was an error storing your model. Please try again.' });
			};

			return ReportsStore.addModel(model, { onSuccess, onError });
		}
	}
}

export default NetworkSettingsModel;
