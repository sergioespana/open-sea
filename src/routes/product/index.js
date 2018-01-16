import { Link, Switch } from 'react-router-dom';
import React, { Fragment } from 'react';
import Product from './product';
import ProductFeatures from './features';
import Route from 'components/Route';

const ProductRoutes = (props) => (
	<Fragment>
		<nav>
			<Link to="/product">Home</Link>
			<Link to="/product/features">Features</Link>
			<Link to="/account/signin">Log in</Link>
			<Link to="/account/signup">Get started</Link>
		</nav>
		<Switch>
			<Route path="/product" exact component={Product} />
			<Route path="/product/features" exact component={ProductFeatures} />
		</Switch>
	</Fragment>
);

export default ProductRoutes;