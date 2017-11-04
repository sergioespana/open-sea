import { h } from 'preact';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Action = ({ action, children, ...props }) => typeof action === 'string' ? (
	<Link to={action} {...props}>{ children }</Link>
) : (
	<button onClick={action} {...props}>{ children }</button>
);

export default styled(Action)`
	border: none;
	font-family: inherit;
	font-size: inherit;
	font-weight: 500;
	text-transform: uppercase;
	text-decoration: none;
	background-color: transparent;
	margin: 0 0 0 24px;
	cursor: pointer;
	color: #90CAF9;

	@media (min-width: 601px) {
		margin: 0 0 0 48px;
	}
`;