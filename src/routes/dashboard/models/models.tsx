import Fuse from 'fuse.js';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MdFileUpload } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button';
import Container from '../../../components/Container';
import EmptyState from '../../../components/EmptyState';
import Header from '../../../components/Header';
import { Section } from '../../../components/Section';
import { Table } from '../../../components/Table';

@inject(app('ReportsStore', 'UIStore'))
@observer
export default class DashboardModelsOverview extends Component<any> {
	input = null;

	componentDidMount () {
		return this.componentWillReceiveProps(this.props);
	}

	componentWillReceiveProps (nextProps) {
		const { state } = nextProps;
		return this.setState({ searchable: new Fuse(state.models, { keys: ['name'] }) });
	}

	render () {
		const { state } = this.props;
		const { models } = state;

		const PageHead = (
			<Header
				title="Models"
				headTitle="dashboard / models"
			>
				{models.length > 0 && <Button appearance="light" onClick={this.openInput}><MdFileUpload width={20} height={20} /></Button>}
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

		if (models.length === 0) return (
			<React.Fragment>
				{PageHead}
				{ModelInput}
				<Container>
					<Section>
						<EmptyState>
							<img src="/assets/images/empty-state-welcome.svg" />
							<h1>Welcome to openSEA model repository</h1>
							<p>
								The openSEA model repository currently contains no models. Why don't
								you <a onClick={this.openInput}>add the first</a>?
							</p>
						</EmptyState>
					</Section>
				</Container>
			</React.Fragment>
		);

		return (
			<React.Fragment>
				{PageHead}
				{ModelInput}
				<Container>
					<Section>
						<Table
							columns={[
								{
									key: 'name',
									label: 'Model',
									format: (name, { _id }) => <Link to={`/dashboard/models/${_id}`}>{name}</Link>
								},
								{
									key: 'version',
									label: 'Version'
								}
							]}
							data={models}
						/>
					</Section>
				</Container>
			</React.Fragment>
		);
	}

	private getRef = (node) => this.input = node;
	private openInput = () => this.input.click();
	private onFileChange = (event) => {
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
			return;
		}

		const json = ReportsStore.parseStrToJson(result);
		return this.validateAndStoreModel(json);
	}
	private validateAndStoreModel = (json) => {
		const { ReportsStore, UIStore } = this.props;
		const { accepted, errors } = ReportsStore.validateModel(json);

		if (!accepted) {
			// TODO: Show first error in errors object in flag description.
			errors.forEach(console.log);
			UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'Your model contained errors.' });
		} else {
			const onSuccess = () => {
				UIStore.addFlag({ appearance: 'success', title: 'Model saved successfully' });
			};
			const onError = (error) => {
				console.log(error);
				UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'There was an error storing your model. Please try again.' });
			};

			return ReportsStore.addModel(accepted, { onSuccess, onError });
		}
	}
}
