import styled from 'styled-components';

export default styled.thead`
	border-bottom: 2px solid ${({ theme }) => theme.light};
	color: ${({ theme }) => theme.text.primary};
`;
