import styled from 'styled-components';

export default styled.div`
	background-color: #ffffff;
	box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.2);
	color: ${({ theme }) => theme.text.secondary};
	font-size: 0.875rem;
	padding: 16px;
`;
