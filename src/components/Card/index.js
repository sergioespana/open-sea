import { h } from 'preact';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import CardTitle from './components/CardTitle';
import CardContent from './components/CardContent';

const Card = ({ to, children, ...props }) => to ? (
	<Link to={to} {...props}>{ children }</Link>
) : (
	<div {...props}>{ children }</div>
);

export {
	CardTitle,
	CardContent
};
export default styled(Card)`
	display: inline-block;
	text-decoration: none;
	color: inherit;
	border-radius: 2px;
	box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
`;