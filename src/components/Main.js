import container from 'styles/container';
import styled from 'styled-components';

const Main = styled.main`
	padding-top: 48px;
	min-height: 100vh;
	${props => props.bg ? `background: ${props.bg};` : null}

	${props => props.container && container}
`;

export default Main;