import { h } from 'preact';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex: auto;

	p {
		margin: 0;
		line-height: 24px;
		padding-left: 30px;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.87);

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
	padding: 12px 12px 12px 24px;
	color: #444;
	text-decoration: none;
	background-color: ${props => props.active ? 'rgba(0, 0, 0, 0.12)' : '#fff' };
	cursor: pointer;
	font-size: 15px;

	svg {
		color: rgba(0,0,0,0.54);
		fill: rgba(0,0,0,0.54);
	}

	:hover {
		background-color: rgba(0, 0, 0, 0.12);;
	}

	:active {
		background-color: #e0e0e0;
	}
`;