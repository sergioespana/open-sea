import Header from 'components/Header';
import Helmet from 'react-helmet';
import Main from 'components/Main';
import React from 'react';

const Networks = () => (
	<Main>
		<Helmet>
			<title>home / networks</title>
		</Helmet>
		<Header title="Networks" />
	</Main>
);

export default Networks;