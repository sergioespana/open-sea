import styled from 'styled-components';

const NavigationHeader = styled.header`
	height: 64px;
	width: 100%;
	display: flex;
	align-items: center;
	${({ center }) => center && `justify-content: center;`}

	h1 {
		color: inherit;
		display: inline-block;
		height: 56px;
		line-height: 56px;
		font-weight: 400;
		margin: 0;
		font-size: 1.8rem;
		cursor: default;
	}
`;

export default NavigationHeader;