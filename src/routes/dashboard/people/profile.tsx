import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import slugify from 'slugify';
import { Button, LinkButton } from '../../../components/Button';
import { Input } from '../../../components/NewInput';
import { Redirect } from '../../../components/Redirect';
import { UserProfileBack, UserProfileContainer, UserProfileHeader } from '../../../components/UserProfile';

@inject(app('AuthStore'))
@observer
export default class DashboardPeopleProfile extends Component<any> {
	state = {
		editing: false
	};

	render () {
		const { AuthStore, match: { params: { name, userId } } } = this.props;
		const { editing } = this.state;
		const user = AuthStore.findById(userId);

		if (name !== slugify(user.name, '+')) return <Redirect to={`/dashboard/people/${userId}/${slugify(user.name, '+')}`} />;

		return (
			<React.Fragment>
				<Helmet title={user.name} />
				<UserProfileHeader>
					<section>
						<UserProfileBack to="/dashboard/people"><MdArrowBack height={18} width={18} />All people</UserProfileBack>
					</section>
					<section>
						<img src={user.avatar} />
						{editing ? (
							<Input
								appearance="inline"
								defaultValue={user.name}
								disabled={!editing}
								isCompact
								placeholder="Your full name"
							/>
						) : <h1>{user.name}</h1>}
					</section>
				</UserProfileHeader>
				{user._isCurrent && (
					<UserProfileContainer flexRight>
						{editing ? (
							<React.Fragment>
								<Button appearance="default" onClick={this.toggleEditing}>Save</Button>
								<Button appearance="subtle" onClick={this.toggleEditing}>Cancel</Button>
							</React.Fragment>
						) : (
							<React.Fragment>
								<Button appearance="default" onClick={this.toggleEditing}>Edit profile</Button>
								<LinkButton appearance="subtle" to="/account/signout">Sign out</LinkButton>
							</React.Fragment>
						)}
					</UserProfileContainer>
				)}
				<UserProfileContainer style={{ display: 'grid', gridColumnGap: '20px', gridTemplateColumns: 'repeat(2, 1fr)' }}>
					<Input
						appearance="inline"
						defaultValue={user.email}
						disabled={!editing}
						label="Email"
						placeholder="Your email address"
					/>
					<Input
						appearance="inline"
						defaultValue={user.nickname}
						disabled={!editing}
						label="Nickname"
						placeholder="Your nickname"
					/>
					<Input
						appearance="inline"
						defaultValue={user.location}
						disabled={!editing}
						label="Based in"
						placeholder="Your location"
					/>
					<Input
						appearance="inline"
						defaultValue={user.timezone}
						disabled={!editing}
						label="Timezone"
						placeholder="Your timezone"
					/>
				</UserProfileContainer>
			</React.Fragment>
		);
	}

	private toggleEditing = () => this.setState(toggleEditing);
}

const toggleEditing = (prevState) => ({ editing: !prevState.editing });
