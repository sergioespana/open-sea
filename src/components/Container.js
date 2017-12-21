import { createElement } from 'react';
import styled from 'styled-components';

const Container = styled(({ component = 'div', flex = false, ...props }) => createElement(component, { ...props }))`
	margin: 0 20px 20px;
	${({ flex }) => flex && `display: flex;`}

	h1 {
		font-weight: 600;
		font-size: 1.05rem;
		letter-spacing: -.006em;
		color: #002c26;

		:not(:first-child) {
			margin-top: 24px;
		}
	}
`;

export default Container;