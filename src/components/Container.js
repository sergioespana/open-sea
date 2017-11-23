import container from 'styles/container';
import { createElement } from 'react';
import styled from 'styled-components';

const Component = ({ component = 'div', children, ...props }) => createElement(component, { ...props }, children);

const Container = styled(Component)`
	${container}
`;

export default Container;