import { inject, observer } from 'mobx-react';
import { app } from 'mobx-app';
import Header from 'components/Header';
import Helmet from 'react-helmet';
import isEmpty from 'lodash/isEmpty';
import Main from 'components/Main';
import Placeholder from 'components/Placeholder';
import React from 'react';

const Networks = inject(app('state'))(observer((props) => {
	const { state } = props;
	const { networks } = state;
	return (
		<Main>
			<Helmet>
				<title>home / networks</title>
			</Helmet>
			<Header title="Networks" />
			{ isEmpty(networks) ? (
				<Placeholder>
					<h1>Whoa there!</h1>
					<p>openSEA does not currently support grouping organisations in networks. Check back later!</p>
				</Placeholder>
			) : null }
		</Main>
	);
}));

export default Networks;