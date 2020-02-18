import { safeDump } from 'js-yaml';
import { isEmpty } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '../../../components/Button';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { Section } from '../../../components/Section';
import { Organisation } from '../../../domain/Organisation';
import MdFileDownload from 'react-icons/lib/md/file-download';

@inject(app('OrganisationsStore', 'InfographicsStore', 'UIStore'))
@observer
class OrganisationSettingsDetails extends Component<any> {
	input = null;


	render () {
		const { match: { params: { orgId } }, OrganisationsStore, state } = this.props;
		const originalOrg = OrganisationsStore.findById(orgId);
		const preventSubmit = true/*state.isBusy || isEqual(organisation, originalOrg)*/;
		const specification = originalOrg.specification;
		const specificationtext = JSON.stringify(originalOrg.specification, null, 2);

		const SpecificationInput = (
			<input
				accept=".yml"
				onChange={this.onFileChange}
				ref={this.getRef}
				style={{ display: 'none' }}
				type="file"
			/>
		);
		return (
			<React.Fragment>
				<Header
					title="Infographic Specification"
					headTitle={`Infographic specification - ${originalOrg.name} / Settings`}
					breadcrumbs={[
						<Link key={`/${orgId}`} to={`/${orgId}`}>{originalOrg.name}</Link>,
						<Link key={`/${orgId}/settings`} to={`/${orgId}/settings`}>Settings</Link>
					]}
				>
					
				{!isEmpty(specification) && <Button appearance="light" onClick={this.exportSpecification(orgId, specification)}><MdFileDownload height={20} width={20} /></Button>}
			
				</Header>
				{SpecificationInput}
				<Container>
					<Section>
							<p>
								The current infographic specification of your organisation is displayed here along<br />
								 with the possibility to upload a new infographic specification.
							</p>
							
							<h3 style={{ marginTop: 25 }}>Current specification</h3>
							<pre>{!isEmpty(specificationtext) && specificationtext}{isEmpty(specificationtext) && 'No infographic specification was found'}</pre>

							<h3 style={{ marginTop: 25 }}>New specification</h3>
							<br/>

							<Button appearance="default" onClick={this.openInput}>Upload new infographic specification</Button>
					</Section>
				</Container>
			</React.Fragment>
		);
	}
/*
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
		const { match: { params: { orgId } }, OrganisationsStore, InfographicsStore, UIStore } = this.props;
		const { accepted, errors } = InfographicsStore.validateSpecification(json);

		if (!accepted) {
			// TODO: Show first error in errors object in flag description.
			errors.forEach(console.log);
			UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'Your specification contained errors.' });
		} else {
			const specification = {...accepted, _orgId: orgId};

			const onSuccess = () => {
				UIStore.addFlag({ appearance: 'success', title: 'Specification saved successfully' });
			};
			const onError = () => {
				UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'There was an error storing your specification. Please try again.' });
			};

			return InfographicsStore.addSpecification(specification, { onSuccess, onError });
		}
	}
*/

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
	const { match: { params: { orgId } }, OrganisationsStore, InfographicsStore, UIStore } = this.props;
	const { accepted, errors } = InfographicsStore.validateSpecification(json);

	if (!accepted) {
		// TODO: Show first error in errors object in flag description.
		errors.forEach(console.log);
		UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'Your specification contained errors.' });
	} else {
		const specification = {...accepted, _orgId: orgId};

		const onSuccess = () => {
			UIStore.addFlag({ appearance: 'success', title: 'Specification saved successfully' });
		};
		const onError = () => {
			UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'There was an error storing your specification. Please try again.' });
		};

		return InfographicsStore.addSpecification(specification, { onSuccess, onError });
	}
}
	private exportSpecification = (orgId, json) => () => {
		const yaml = safeDump(json);
		const blob = new Blob([yaml], {
			type: 'text/plain;charset=utf-8'
		});
		const url = window.URL.createObjectURL(blob);

		let a = document.createElement('a');
		a.setAttribute('hidden', 'true');
		a.setAttribute('href', url);
		a.setAttribute('download', `Specification ${orgId}.yml`);

		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
	}
}

export default withRouter(OrganisationSettingsDetails);
