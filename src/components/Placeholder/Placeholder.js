import styled from 'styled-components';

const Placeholder = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	flex: auto;
	width: 100%;
	padding-top: 80px;

	img {
		max-width: 180px;
		max-height: 180px;
	}

	h1 {
		font-size: 1.125rem;
		font-weight: 500;
		color: ${({ theme }) => theme.text.primary};
		margin: 2rem 0 0 0;
	}

	p {
		color: ${({ theme }) => theme.text.secondary};
		margin-top: 0.65rem;
	}
`;

export default Placeholder;