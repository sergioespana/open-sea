import React, { SFC } from 'react';
import styled from '../../util/styled-components';

const UnstyledWrapper: SFC = ({ children, ...props }) => <div {...props}><article role="dialog">{children}</article></div>;

export default styled(UnstyledWrapper)`
	align-items: center;
	bottom: 0;
	display: flex;
	flex-direction: column;
	left: 0;
	pointer-events: none;
	position: fixed;
	right: 0;
	top: 0;
	z-index: 10;

	& > article {
		background-color: #ffffff;
		box-shadow: rgba(9, 30, 66, 0.08) 0px 0px 0px 1px, rgba(9, 30, 66, 0.08) 0px 2px 1px, rgba(9, 30, 66, 0.31) 0px 0px 20px -6px;
		border-radius: 3px;
		margin: 60px;
		min-width: 400px;
		pointer-events: all;
	}
`;
