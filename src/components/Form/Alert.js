import { darken, lighten } from 'polished';
import MdInfoOutline from 'react-icons/lib/md/info-outline';
import React from 'react';
import styled from 'styled-components';

const getColor = (type) => {
	switch (type) {
		case 'error': return '#ffbdad';
		default: return '#b3d4ff';
	}
};

const Alert = styled(({ color, message, type, ...props }) => !message ? null : (
	<div {...props}>
		<MdInfoOutline width={24} height={24} />
		<p>{ message }</p>
	</div>
)).attrs({
	color: ({ type }) => getColor(type)
})`
	margin: 10px 0;
	padding: 16px;
	display: flex;
	border: 1px solid ${({ color }) => color};
	border-radius: 5px;
	background-color: ${({ color }) => lighten(0.11, color)};
	/* font-size: 0.875rem */;
	line-height: 24px;

	p {
		margin: 0;
	}

	svg {
		color: ${({ color }) => darken(0.4, color)};
		margin-right: 16px;
	}
`;

export default Alert;