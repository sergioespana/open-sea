import styled from 'styled-components';

const Actions = styled.div`
	display: flex;
	align-items: flex-end;

	& > *:not(:last-child) {
		margin-right: 4px;
	}
`;

export default Actions;