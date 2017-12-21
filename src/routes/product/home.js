import { Link } from 'react-router-dom';
import React from 'react';

const Home = () => (
	<main>
		<h1>Product overview home</h1>
		<Link to="/account/signin">Log in</Link>
	</main>
);

export default Home;