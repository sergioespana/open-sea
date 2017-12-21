import { Route, Switch } from 'react-router-dom';
import Home from './home';
import React from 'react';

const Product = () => (
	<Switch>
		<Route path="/product" exact component={Home} />
		<Route path="/product/features" />
	</Switch>
);

export default Product;