import styled from '../../util/styled-components';

export default styled.form`
	background-color: #ffffff;
	margin: 0 0 48px 0;
	padding: 48px;
	width: 100%;

	@media (min-width: 601px) {
		border-radius: 3px;
		box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 10px;
		max-width: 400px;
	}

	& > :not(:last-child) {
		margin-bottom: 24px;
	}

	& > button {
		height: 39px;
		width: 100%;
	}

	& > p {
		color: ${({ theme }) => theme.text.secondary};
		font-size: 0.875rem;

		a {
			color: inherit;
			text-decoration: underline;
		}
	}
`;
