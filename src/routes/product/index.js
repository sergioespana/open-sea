import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React from 'react';

const Product = () => (
	<BrowserRouter basename="/product">
		<Switch>
			<Route path="/" />
			<Route path="/features" />
		</Switch>
	</BrowserRouter>
);

export default Product;