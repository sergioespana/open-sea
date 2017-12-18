import React, { PureComponent } from 'react';
import StandaloneForm, { FormButtonsContainer } from 'components/StandaloneForm';
import Button from 'components/Button';
import { inject } from 'mobx-react';
import Input from 'components/Input';
import { Link } from 'react-router-dom';
import linkState from 'linkstate';
import Main from 'components/Main';
import slug from 'slug';

@inject('OrganisationsStore', 'ReportsStore') class New extends PureComponent {
	state = {
		name: 'My Report',
		org: null
	}

	onSubmit = (event) => {
		event.preventDefault();
		let { ReportsStore } = this.props,
			{ name, org } = this.state;

		return ReportsStore.create(org, name);
	}

	render = () => {
		const { name, org } = this.state,
			{ OrganisationsStore } = this.props;
		
		let sluggedName = slug(name).toLowerCase();
		if (sluggedName === '') sluggedName = 'my-report';
		
		const disableButton = sluggedName === 'my-report';

		return (
			<Main>
				<StandaloneForm
					title="Create a new report"
					onSubmit={this.onSubmit}
				>
					<Input
						label="Report name"
						help={<span>Your report's ID will be <strong>{ sluggedName }</strong></span>}
						value={name}
						onChange={linkState(this, 'name')}
					/>
					<Input
						type="select"
						label="Organisation"
						value={org}
						options={Object.keys(OrganisationsStore.findById(null, true)).map((id) => { return { text: OrganisationsStore.findById(id, true).name, value: id }; })}
						onChange={linkState(this, 'org')}
					/>
					<FormButtonsContainer>
						<Button type="submit" disabled={disableButton}>Create report</Button>
						<Link to="/">Cancel</Link>
					</FormButtonsContainer>
				</StandaloneForm>
			</Main>
		);
	}
}

export default New;