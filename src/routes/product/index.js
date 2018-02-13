import React, { Fragment } from 'react';
import { NavLink } from 'components/Link';
import Product from './product';
import ProductFeatures from './features';
import Route from 'components/Route';
import styled from 'styled-components';
import { Switch } from 'react-router-dom';

const Navigation = styled.nav`
	position: sticky;
	height: 56px;
	display: flex;
	align-items: center;
`;

const NavigationItem = styled(({ cta, ...props }) => <NavLink {...props} />)`
	font-size: 1.25rem;
	height: 100%;
	display: flex;
	align-items: center;
	padding: 0 5px;
	margin: 0 8px;

	&[aria-current="true"] {
		font-weight: 500;
	}

	${({ cta }) => cta && `
		padding: 3px 8px;
		height: auto;
		border: 1px solid #0052CC;
		border-radius: 3px;
		font-weight: 500;
		color: inherit;
		transition: all 200ms ease;

		:hover {
			color: #ffffff;
			background-color: #0052CC;
			text-decoration: none;
		}
	`}
`;

const NavigationSeparator = styled.div`
	flex: auto;
`;

const ProductRoutes = (props) => (
	<Fragment>
		<Navigation>
			<NavigationItem to="/product" exact>Home</NavigationItem>
			<NavigationItem to="/product/features">Features</NavigationItem>
			<NavigationSeparator />
			<NavigationItem to="/account/signin">Log in</NavigationItem>
			<NavigationItem to="/account/signup" cta>Get started</NavigationItem>
		</Navigation>
		<Switch>
			<Route path="/product" exact component={Product} />
			<Route path="/product/features" exact component={ProductFeatures} />
		</Switch>
	</Fragment>
);

export default ProductRoutes;