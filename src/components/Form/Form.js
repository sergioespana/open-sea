import styled, { css } from 'styled-components';
import React from 'react';

const standalone = css`
	padding: 30px;
	/* border: 1px solid #ccc; */
	/* border-radius: 5px; */
	margin: 60px auto;
`;

const Form = styled(({ standalone, ...props }) => <form {...props} />)`
	width: 600px;
	${(props) => props.standalone && standalone}

	header {
		padding: 0 0 12px;
		
		h1 {
			margin: 0;
			font-weight: 500;
			font-size: 1.5rem;
		}
		
		& + section {
			padding: 20px 0 0;
		}
	}
	
	section {
		width: 100%;
		
		& > h1 {
			font-size: 1rem;
			font-weight: 600;
			
			&:first-child {
				margin-top: 0;
			}
		}
	}
	
	footer {
		display: flex;
		align-items: center;
		justify-content: 'flex-start';
		padding: 24px 0;
		margin-top: 24px;
		border-top: 1px solid #ccc;

		& > :not(:first-child) {
			margin-left: 10px;
		}
	}
`;

export default Form;