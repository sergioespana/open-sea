import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import slugify from 'slugify';
import { Button } from '../../../components/Button';
import { Container } from '../../../components/Container';
import { TextField } from '../../../components/Input';
import { Redirect } from '../../../components/Redirect';
import { Section } from '../../../components/Section';
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
		const user = AuthStore.getItem(userId, '_id');

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
							<TextField
								appearance="inline"
								compact
								defaultValue={user.name}
								disabled={!editing}
								placeholder="Your full name"
							/>
						) : <h1>{user.name}</h1>}
					</section>
				</UserProfileHeader>
				{user._isCurrent && (
					<UserProfileContainer flexRight>
						{editing ? (
							<React.Fragment>
								<Button onClick={this.toggleEditing}>Save</Button>
								<Button appearance="subtle" onClick={this.toggleEditing}>Cancel</Button>
							</React.Fragment>
						) : (
							<React.Fragment>
								<Button onClick={this.toggleEditing}>Edit profile</Button>
								<Button appearance="subtle" to="/account/signout">Sign out</Button>
							</React.Fragment>
						)}
					</UserProfileContainer>
				)}
				<UserProfileContainer style={{ display: 'grid', gridColumnGap: '20px', gridTemplateColumns: 'repeat(2, 1fr)' }}>
					<TextField
						appearance="inline"
						defaultValue={user.email}
						disabled={!editing}
						label="Email"
						placeholder="Your email address"
					/>
					<TextField
						appearance="inline"
						defaultValue={user.nickname}
						disabled={!editing}
						label="Nickname"
						placeholder="Your nickname"
					/>
					<TextField
						appearance="inline"
						defaultValue={user.location}
						disabled={!editing}
						label="Based in"
						placeholder="Your location"
					/>
					<TextField
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
