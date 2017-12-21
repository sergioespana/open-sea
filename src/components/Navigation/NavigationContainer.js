import styled from 'styled-components';

const NavigationContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: ${({ fullWidth }) => fullWidth ? 'flex-start' : 'center'};
	width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
	max-width: 100%;
	padding: ${({ fullWidth }) => fullWidth ? '0 16px' : '0 8px'};
	overflow: hidden;
`;

export default NavigationContainer;