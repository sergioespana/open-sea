import { h } from 'preact';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ItemWrapper = ({ to, href, children, ...props }) => to ? (
	<Link to={to} {...props}>{ children }</Link>
) : href ? (
	<a href={href} {...props}>{ children }</a>
) : (
	<div {...props}>{ children }</div>
);

export default styled(ItemWrapper)`
	padding: 0 20px;
	min-height: ${props => props.secondary ? 64 : 48 }px;
	display: flex;
	flex-direction: row;
	align-items: center;
	text-decoration: none;
	color: inherit;
	cursor: ${props => props.onClick || props.to ? 'pointer' : 'default' };

	:not(:last-child) {
		border-bottom: 1px solid #eee;
	}
`;