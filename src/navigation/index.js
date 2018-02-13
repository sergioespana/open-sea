import { Content, Header, Inner, Button, Section } from 'components/Navigation';
import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import MdHome from 'react-icons/lib/md/home';

const iconProps = { width: 24, height: 24 };

const DefaultNavigation = inject(app('state'))(observer((props) => {
	const { state } = props;
	const { loading } = state;

	return (
		<Fragment>
			<Section width={64}>
				<Inner>
					<Content fill>
						<Header loading={loading}>
							<Button to="/" round><MdHome {...iconProps} /></Button>
						</Header>
					</Content>
				</Inner>
			</Section>
		</Fragment>
	);
}));

export default DefaultNavigation;