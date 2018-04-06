import styled from '../../util/styled-components';

export default styled.footer`
	display: flex;
	flex: auto;
	flex-direction: column-reverse;
	justify-content: space-between;
	margin: 0 0 48px 0;
	text-align: center;

	@media (max-width: 600px) {
		color: ${({ theme }) => theme.text.primary};
	}

	@media (min-width: 601px) {
		color: ${({ theme }) => theme.text.contrast};
	}

	a {
		color: inherit;
		display: block;

		:hover {
			color: inherit;
		}
	}
`;
