import styled from 'styled-components';

export default styled.tbody`
	border-bottom: 2px solid ${({ theme }) => theme.light};
	color: ${({ theme }) => theme.text.secondary};
`;
