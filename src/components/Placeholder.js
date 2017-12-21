import { darken } from 'polished';
import React from 'react';
import styled from 'styled-components';

const Placeholder = styled(({ ...props }) => <div {...props} />)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	
	h1 {
		font-size: 1rem;
		font-weight: 500;
		color: ${({ theme }) => darken(0.7, theme.primary)};
		margin: 2rem 0 0 0;
	}

	p {
		color: #707070;
		margin-top: 0.65rem;
	}
`;

export default Placeholder;