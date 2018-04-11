import styled from '../../util/styled-components';

export default styled.input`
	border: none;
	font-family: inherit;
	font-size: 1.5rem;
	font-weight: inherit;
	height: 40px;
	width: 100%;

	::placeholder {
		color: ${({ theme }) => theme.text.secondary};
	}
`;
