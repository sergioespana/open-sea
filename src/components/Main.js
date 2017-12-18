import container from 'styles/container';
import styled from 'styled-components';

const Main = styled.main`
	height: 100%;
	flex: auto;
	overflow: auto;
	${({ bg }) => bg ? `background: ${bg};` : null}

	${props => props.container && container}
`;

export default Main;