import { h } from 'preact';
import styled from 'styled-components';

// TODO: Add icons upport

const Avatar = ({ src, children, ...props }) => {
	if (src) return <img src={src} {...props} />;

	if (typeof children === 'string') {
		let words = children.split(' ').slice(0, 2),
			res = words.map((str) => str[0]);
		return <div {...props}>{ res }</div>;
	}
}

export default styled(Avatar)`
	position: relative;
	width: ${props => props.size || 40}px;
	height: ${props => props.size || 40}px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background-color: rgb(185, 185, 185);
	color: #fff;
	font-family: inherit;
	font-size: 16px;
`;