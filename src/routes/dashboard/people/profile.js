import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Container from 'components/Container';
import Helmet from 'react-helmet';
import { Link } from 'components/Link';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import ProfileHeader from 'components/ProfileHeader';
import slugify from 'slugify';
import { TextField } from 'components/Input';

const iconProps = { width: 20, height: 20 };

@inject(app('AuthStore'))
@observer
class DashboardPeopleProfile extends Component {
	state = {
		editing: false
	}

	componentDidMount = () => {
		const { AuthStore, history, match: { params: { name, uid } } } = this.props;
		const user = AuthStore.getItem(uid, '_uid') || {};

		const sluggedName = slugify(user.name, '+');

		if (name === sluggedName) return;
		return history.replace(`/dashboard/people/${uid}/${sluggedName}`);
	}

	render = () => {
		const { AuthStore, match: { params: { uid } } } = this.props;
		const { editing } = this.state;
		const user = AuthStore.getItem(uid, '_uid') || {};

		return (
			<Fragment>
				<Helmet title={`${user.name} - Profile`} />
				<ProfileHeader>
					<section>
						<Link to="/dashboard/people"><MdArrowBack {...iconProps} /><span>All people</span></Link>
					</section>
					<section>
						<img src={user.avatar} />
						<h1>{ user.name }</h1>
					</section>
				</ProfileHeader>
				<Container width={50}>
					{ user._isCurrent ? editing ? null : <Button appearance="subtle">Edit profile</Button> : null }
					<TextField
						type="email"
						disabled={!editing}
						defaultValue={user.email}
					/>
					<TextField
						type="text"
						disabled={!editing}
						defaultValue={user.name}
					/>
				</Container>
			</Fragment>
		);
	}
}

export default DashboardPeopleProfile;