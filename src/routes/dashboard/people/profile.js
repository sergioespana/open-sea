import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Container from 'components/Container';
import { darken } from 'polished';
import Helmet from 'react-helmet';
import { Link } from 'components/Link';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import slugify from 'slugify';
import styled from 'styled-components';
import { TextField } from 'components/Input';

const ProfileHeader = styled.header`
	color: #ffffff;
	background-color: ${({ theme }) => darken(0.1, theme.primary)};
	margin-bottom: 25px;

	section {
		display: flex;
		align-items: flex-end;
		padding-top: 24px 0 0;

		&:first-child {
			padding: 24px 0;
		}

		h1 {
			padding: 16px 0;
			margin: 0 0 0 24px;
		}

		a {
			:hover {
				text-decoration: none;
			}

			:not(:hover) {
				color: #ffffff;
			}

			* {
				vertical-align: middle;
			}
		}
	}

	img {
		border-radius: 50%;
		width: 130px;
		height: 130px;
		object-fit: contain;
		margin-bottom: -25px;
	}
`;

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
				<Container>
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