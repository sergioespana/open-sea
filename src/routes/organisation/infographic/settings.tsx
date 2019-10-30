import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import Button from '../../../components/Button';
import Container from '../../../components/Container';
import Form, { FormActions } from '../../../components/Form';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import Input from '../../../components/NewInput';
import { Section } from '../../../components/Section';
import collection from '../../../stores/collection';

const OrganisationInfographicSettings = inject(app('OrganisationsStore', 'InfographicsStore'))(observer((props) => {
	const { match: { params: { orgId, infographicId } }, OrganisationsStore, history } = props;
	const organisation = OrganisationsStore.findById(orgId);
	const infographic = collection(organisation._infographics).findById(`${orgId}/${infographicId}`);
	
	const onSubmitDelete = (event) => {
		event.preventDefault();
		
		const onSuccess = () => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			collection(organisation._infographics).remove(infographic);
			history.push(`infographics/}`);
		};

		const onError = (error) => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			// TODO: Show flag
			console.log('failed:', error);
		};		
		
		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return OrganisationsStore.removeInfographic(infographic, { onSuccess, onError });
	}

	const PageHead = (
		<Header
			title="Settings"
			headTitle={`Settings - ${organisation.name} / ${infographic.name}`}
			breadcrumbs={[
				<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
				<Link key={`/${orgId}/infographics`} to={`/${orgId}/infographics`}>Infographics</Link>,
				<Link key={`/${orgId}/infographics/${infographicId}`} to={`/${orgId}/infographics/${infographicId}`}>{infographic.name}</Link>
			]}
		/>
	);

	return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Section>
					<h3>Details</h3>
					<p>
						<Form onSubmit={onSubmit}>
							<Input
								appearance="default"
								defaultValue={infographic.name}
								disabled
								label="Name"
								isCompact
								type="text"
							/>
							<Input
								appearance="default"
								disabled
								label="Public"
								help="This setting is inherited from the organisation's settings. In the future, you will be able to make an infographic publicly available separately from its organisation."
								isCompact
								placeholder="This is a public infographic"
								type="checkbox"
								value={organisation.isPublic}
							/>
							<FormActions>
								<Button appearance="default" disabled type="submit">Save changes</Button>
								{/* <Button appearance="link" type="reset">Cancel</Button> */}
							</FormActions>
						</Form>
					</p>
					<h3>Advanced</h3>
					<Form onSubmit={onSubmitDelete}>
					<p>
						<Button appearance="error" type="submit">Delete this infographic</Button>
					</p>
					</Form>
				</Section>
			</Container>
		</React.Fragment>
	);
	
}));

const onSubmit = (event) => event.preventDefault();


export default OrganisationInfographicSettings;
