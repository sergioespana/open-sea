import React from 'react';
import styled from 'styled-components';

export const FormButtonsContainer = styled.div`
	padding: 32px 0 0;
	display: flex;
	align-items: center;
	justify-content: ${({ left }) => left ? 'flex-start' : 'flex-end'};

	a {
		padding: 5px 10px;
	}
`;

const StandaloneForm = styled(({ children, onSubmit, secondary, title, ...props }) => (
	<div {...props}>
		<header>
			<h1>{ title }</h1>
			{ secondary && <span>{ secondary }</span> }
		</header>
		<form onSubmit={onSubmit}>
			{ children }
		</form>
	</div>
))`
	max-width: 600px;
	background: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 40px auto 60px;
	padding: 30px;
	font-size: 0.875rem;
	
	header {
		padding: 0 0 12px;
		position: relative;

		h1 {
			font-size: 1.5rem;
			font-weight: 500;
			margin: 0;
		}
	}

	form {
		padding: 20px 0 0;
		border-top: 1px solid #ccc;
	}
`;

export default StandaloneForm;