import styled, { css } from 'styled-components';
import React from 'react';

const standalone = css`
	padding: 30px;
	border: 1px solid #ccc;
	border-radius: 5px;
	margin: 60px auto;
`;

const Form = styled(({ standalone, ...props }) => <form {...props} />)`
	width: 600px;
	${(props) => props.standalone && standalone}

	header {
		padding: 0 0 12px;
		border-bottom: 1px solid #ccc;

		h1 {
			margin: 0;
			font-weight: 500;
			font-size: 1.5rem;
		}

		& + header {
			padding: 20px 0 0;
		}
	}

	section {
		width: 100%;

		h1 {
			font-size: 1rem;
			font-weight: 600;

			&:first-child {
				margin-top: 0;
			}
		}

		p {
			font-size: 0.875rem;
		}
	}

	footer {
		display: flex;
		align-items: center;
		justify-content: ${({ standalone }) => standalone ? 'flex-end' : 'flex-start'};
		padding: 16px 16px 16px 0;

		& > :not(:first-child) {
			margin-left: 10px;
		}
	}
`;

export default Form;