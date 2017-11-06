import { h } from 'preact';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex: auto;

	p {
		margin: 0;

		:last-child {
			color: rgb(117, 117, 117);
		}
	}
`;

const Item = ({ to, primary, secondary, icon, ...props }) => to ? (
	<Link to={to} {...props}>
		{ icon }
		<TextContainer>
			<p>{ primary }</p>
			<p>{ secondary }</p>
		</TextContainer>
	</Link>
) : (
	<div {...props}>
		{ icon }
		<TextContainer>
			<p>{ primary }</p>
			<p>{ secondary }</p>
		</TextContainer>
	</div>
);

export default styled(Item)`
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
	height: ${props => props.secondary ? 64 : 32}px;
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