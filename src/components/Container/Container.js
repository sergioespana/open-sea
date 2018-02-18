import styled, { css } from 'styled-components';
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

const Container = styled(({ flex, wrap, ...props }) => <div {...props} />)`
	margin: 0 20px 20px;

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