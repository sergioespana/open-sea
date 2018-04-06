import styled from '../util/styled-components';

export const FormActions = styled.div`
	display: flex;
	flex-wrap: nowrap;

	& > * {
		margin-right: 8px;
	}
`;

export default styled.form`
	margin: 0 auto;
	max-width: 800px;
	width: 100%;

	& > * {
		margin-bottom: 24px;
	}
`;
