import React, { Fragment } from 'react';
import { Switch } from 'react-router-dom';
import { NavLink as Link } from '../../components/Link/index';
import { Route } from '../../components/Route/index';
import ProductFeatures from './features';
import Product from './product';

const ProductRoutes = () => (
	<Fragment>
		<header>
			<Link to="/product">Home</Link>
			<Link to="/product/features">Features</Link>
			<Link to="/account/signin">Log in</Link>
			<Link to="/account/signup">Get started</Link>
		</header>
		<main>
			<Switch>
				<Route path="/product" exact component={Product} />
				<Route path="/product/features" exact component={ProductFeatures} />
			</Switch>
		</main>
	</Fragment>
);

export default ProductRoutes;
