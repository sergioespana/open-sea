import { h } from 'preact';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Ripple from './Ripple';

const Button = ({ to, children, ripple = true, ...props }) => to ? (
	<Link to={to} {...props}>
		<span>{ children }</span>
		{ ripple && <Ripple /> }
	</Link>
) : (
	<button {...props}>
		<span>{ children }</span>
		{ ripple && <Ripple /> }
	</button>
);

export default styled(Button)`
	position: relative;
	height: 32px;
	min-width: 88px;
	display: inline-flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
	text-transform: uppercase;
	text-align: center;
	font-family: inherit;
	font-size: 14px;
	font-weight: 500;
	border: none;
	padding: 0 8px;
	margin: 0 8px;
	border-radius: 2px;
	box-shadow: ${props => !props.disabled && props.raised ? '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)' : 'none'};
	transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
	pointer-events: ${props => props.disabled ? 'none' : 'all' };

	:hover {
		cursor: pointer;
	}
	
	:active {
		box-shadow: ${props => !props.disabled && props.raised ? '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)' : 'none'};
	}

	 > span:first-child {
		width: 100%;
		text-align: center;
	}
`;