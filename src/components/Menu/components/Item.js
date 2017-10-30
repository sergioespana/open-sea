import { h } from 'preact';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Item = ({ to, children, ...props }) => to ? (
	<Link to={to} {...props}>{ children }</Link>
) : (
	<div {...props}> { children }</div>
);

export default styled(Item)`
	display: flex;
	align-items: center;
	height: 32px;
	padding: 0 24px;
	color: #444;
	text-decoration: none;
	background-color: ${props => props.active ? 'rgba(0, 0, 0, 0.12)' : '#fff' };
	cursor: pointer;
	font-size: 15px;

	:hover {
		background-color: rgba(0, 0, 0, 0.12);;
	}

	:active {
		background-color: #e0e0e0;
	}
`;