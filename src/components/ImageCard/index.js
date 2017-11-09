import { h } from 'preact';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

let Wrapper = ({ to, children, ...props }) => to ? (
	<Link to={to} {...props}>{ children }</Link>
) : (
	<div {...props}>{ children }</div>
);

Wrapper = styled(Wrapper)`
	position: relative;
	cursor: ${props => (props.to || props.onClick) ? 'pointer' : 'auto' };
	text-decoration: none;
`;

const Image = styled.div`
	background-image: url(${props => props.src});
	background-size: cover;
	background-position: center center;
	background-repeat: no-repeat;
	border-radius: 2px;
	padding-bottom: 100%;
	position: relative;
	border: 1px solid #e4e4e4;

	> * {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, 0);
	}
	
	> svg {
		height: 25%;
		width: 25%;
		fill: #3b78e7;
	}
`;

const PrimaryText = styled.p`
	color: rgba(0,0,0,0.87);
	font-family: inherit;
	font-size: 13px;
	font-weight: 500;
	line-height: 18px;
	overflow: hidden;
	padding-top: 8px;
	word-break: break-word;
	word-wrap: break-word;
	text-overflow: ellipsis;
	max-height: 36px;
	margin: 0;
`;
	
const SecondaryText = styled.p`
	font-family: inherit;
	font-size: 12px;
	font-weight: 400;
	color: rgba(0,0,0,0.54);
	padding-top: 2px;
	line-height: 16px;
	margin: 0;
`;

const ImageCard = ({ primary, secondary, src, icon, onClick, to }) => (
	<Wrapper to={to} onClick={onClick}>
		{ src && <Image src={src} /> }
		{ !src && icon && <Image>{ icon }</Image> }
		{ primary && <PrimaryText>{ primary }</PrimaryText> }
		{ secondary && <SecondaryText>{ secondary }</SecondaryText> }
	</Wrapper>
);

export default ImageCard;