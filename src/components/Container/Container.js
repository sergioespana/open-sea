import styled, { css } from 'styled-components';
import isNumber from 'lodash/isNumber';
import React from 'react';

const flex = css`
	display: flex;
	${({ wrap }) => wrap && `flex-wrap: wrap;`}

	& > section {
		padding: 20px 20px 100px 20px;

		&:not(:first-child) {
			border-left: 1px solid #ccc;
		}

		&:first-child {
			padding-left: 0px;
		}

		&:last-child {
			padding-right: 0px;
		}
	}
`;

const Container = styled(({ flex, width, wrap, ...props }) => <div {...props} />)`
	margin: ${({ width }) => isNumber(width) ? '0 auto 20px auto' : '0 20px 20px'};
	width: ${({ width }) => isNumber(width) ? `${width}%` : 'auto'};

	& > section {
		height: 100%;

		h1 {
			font-size: 1.125rem;
			font-weight: 600;
		}
	}
	
	${(props) => props.flex && flex}
`;

export default Container;