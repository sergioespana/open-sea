import styled from '../../util/styled-components';

export default styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	width: 100%;

	@media (max-width: 600px) {
		background-color: #ffffff;
	}

	@media (min-width: 601px) {
		background-color: ${({ theme }) => theme.primary};
	}
`;
