import styled from '../../util/styled-components';

export default styled.header`
	padding-top: 48px;
	text-align: center;

	@media (max-width: 600px) {
		color: ${({ theme }) => theme.text.primary};
	}

	@media (min-width: 601px) {
		color: ${({ theme }) => theme.text.contrast};
	}

	h1 {
		font-size: 3rem;
		font-weight: 300;
		margin: 0 0 2rem 0;
	}

	h2 {
		font-size: 1.625rem;
		font-weight: 500;
		margin: 0 0 48px 0;
	}
`;
