import React, { SFC } from 'react';
import styled from '../../util/styled-components';

interface WrapperProps {
	width?: number;
}

const UnstyledWrapper: SFC<WrapperProps> = (props) => <aside {...props} />;

export default styled(UnstyledWrapper)`
	background-color: #ffffff;
	bottom: 0;
	display: flex;
	flex-wrap: nowrap;
	left: 0;
	position: fixed;
	top: 0;
	width: ${({ width }) => width || 304}px;
	z-index: 10;

	h3 {
		margin-top: 24px;
	}
`;
