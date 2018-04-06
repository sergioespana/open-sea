import styled from 'styled-components';

export default styled.div`
	margin: 0 auto;
	max-width: 400px;
	padding-top: 80px;
	text-align: center;

	& > img {
		max-width: 180px;
		max-height: 180px;
	}

	& > h1 {
		font-size: 1.125rem;
		margin: 2rem 0 0 0;
	}

	& > p {
		color: ${({ theme }) => theme.text.secondary};
		margin-top: 0.65rem;
	}
`;
