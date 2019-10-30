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

@inject(app('OrganisationsStore', 'InfographicsStore', 'UIStore'))
@observer
class OrganisationsInfographicSpecification extends Component<any> {
	input = null;

	render () {
		const { match: { params: { orgId, infographicId } }, OrganisationsStore } = this.props;
		const organisation = OrganisationsStore.findById(orgId);
		const parentNetwork = OrganisationsStore.findParentNetworkById(orgId);
		const infographic = collection(organisation._infographics).findById(`${orgId}/${infographicId}`);
		
		const specificationInfographic = infographic.specification;
		const specificationOrganisation = organisation.specification;
		const specificationNetwork = parentNetwork ? parentNetwork.specification : null;

		const specification = get(infographic || parent, 'specification');


		const title = infographicId ? `Specification - ${organisation.name} / ${infographic.name}` : `Specification - ${organisation.name} / Settings`;
		const breadcrumbs = infographicId ? [
			<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
			<Link key={`/${orgId}/infographics`} to={`/${orgId}/infographics`}>Infographics</Link>,
			<Link key={`/${orgId}/infographics/${infographicId}`} to={`/${infographicId}/infographics/${infographicId}`}>{infographic.name}</Link>
		] : [
			<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
			<Link key={`/${orgId}/settings`} to={`/${orgId}/settings`}>Settings</Link>
		];
		const PageHead = (
			<Header
				title="Specification"
				headTitle={title}
				breadcrumbs={breadcrumbs}
			>
				{!isEmpty(specificationInfographic) && <Button appearance="light" onClick={this.exportSpecification(infographicId, specification)}><MdFileDownload height={20} width={20} /></Button>}
				{!isEmpty(specificationInfographic) && <Button appearance="light" onClick={this.openInput}>Upload new</Button>}
			</Header>
		);
		const SpecificationInput = (
			<input
				accept=".yml"
				onChange={this.onFileChange}
				ref={this.getRef}
				style={{ display: 'none' }}
				type="file"
			/>
		);

		if (isEmpty(specificationInfographic)) return (
			<React.Fragment>
				{PageHead}
				{SpecificationInput}
				<Container>
					<EmptyState>
						<img src="/assets/images/empty-state-no-model.svg" />
						<h1>Let's get started</h1>
						{parentNetwork ? (
							<p>
								Since your organisation belongs to a network, you may use the network's infographic specification. You may also upload a new infographic specification. Learn more
								about openSEA infographic specifications <a>here</a>.
							</p>
						) : (
							<p>
								The interface around this infographic is derived from an infographic specification which this report lacks.
								Learn more about openSEA infographic specifications<a>here</a>.
							</p>
						)}
						<p>
							<Button appearance="default" onClick={this.openInput}>Upload infographic specification</Button>
							{!isEmpty(specificationOrganisation) && <Button appearance="link" onClick={this.copySpecificationOrganisation}>Use organisation's infographic specification</Button>}
							{!isEmpty(specificationNetwork) && <Button appearance="link" onClick={this.copySpecificationNetwork}>Use network's infographic specification</Button>}
						</p>
					</EmptyState>
				</Container>
			</React.Fragment>
		);

		return (
			<React.Fragment>
				{PageHead}
				{SpecificationInput}
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
						<h3>Current specification</h3>
						<pre>{JSON.stringify(specificationInfographic, null, 2)}</pre>
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
		const { InfographicsStore, UIStore } = this.props;
		
		if (!result) {
			UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'Could not read the selected file.' });
			return;
		}

		const json = InfographicsStore.parseStrToJson(result);
		return this.validateAndStoreSpecification(json);
	}
	private validateAndStoreSpecification = (json) => {
		const { match: { params: { orgId, infographicId } }, OrganisationsStore, InfographicsStore, UIStore } = this.props;
		const { accepted, errors } = InfographicsStore.validateSpecification(json);

		if (!accepted) {
			// TODO: Show first error in errors object in flag description.
			errors.forEach(console.log);
			UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'Your specification contained errors.' });
		} else {
			const parentNetwork = OrganisationsStore.findParentNetworkById(orgId);
			/*
			const specification = parentNetwork
				? { ...get(parentNetwork, 'specification'), ...accepted, _orgId: orgId, _infographicId: infographicId }
				: { ...accepted, _orgId: orgId, _infographicId: infographicId };
			*/
			const specification = {...accepted, _orgId: orgId, _infographicId: infographicId};

			const onSuccess = () => {
				UIStore.addFlag({ appearance: 'success', title: 'Specification saved successfully' });
			};
			const onError = () => {
				UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'There was an error storing your specification. Please try again.' });
			};

			return InfographicsStore.addSpecification(specification, { onSuccess, onError });
		}
	}
	private copySpecificationOrganisation = () => {
		const { match: { params: { orgId } }, OrganisationsStore } = this.props;
		const organisation = OrganisationsStore.findById(orgId);
		const specification = toJS(get(organisation, 'specification'));
		return this.validateAndStoreSpecification(specification);
	}
	private copySpecificationNetwork = () => {
		const { match: { params: { orgId } }, OrganisationsStore } = this.props;
		const network = OrganisationsStore.findParentNetworkById(orgId);
		const specification = toJS(get(network, 'specification'));
		return this.validateAndStoreSpecification(specification);
	}
	private exportSpecification = (infographicId, json) => () => {
		const yaml = safeDump(json);
		const blob = new Blob([yaml], {
			type: 'text/plain;charset=utf-8'
		});
		const url = window.URL.createObjectURL(blob);

		let a = document.createElement('a');
		a.setAttribute('hidden', 'true');
		a.setAttribute('href', url);
		a.setAttribute('download', `Specification ${infographicId}.yml`);

		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
	}
}

export default OrganisationsInfographicSpecification;
