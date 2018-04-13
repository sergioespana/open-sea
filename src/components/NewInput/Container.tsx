import styled from '../../util/styled-components';

export default styled.label`
	align-items: center;
	display: flex;
	flex-wrap: nowrap;

	:hover {
		cursor: pointer;
	}

	& > img {
		border-radius: 3px;
		height: 40px;
		margin: 0 6px 0 0;
		width: 40px;
	}

	& > input {
		display: none;
	}
`;
