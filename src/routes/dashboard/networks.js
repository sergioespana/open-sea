import React, { Fragment } from 'react';
import Container from 'components/Container';
import Header from 'components/Header';
import Helmet from 'react-helmet';

const DashboardNetworks = () => (
	<Fragment>
		<Helmet>
			<title>dashboard / networks</title>
		</Helmet>
		<Header>
			<h1>Networks</h1>
		</Header>
		<Container />
	</Fragment>
);

export default DashboardNetworks;