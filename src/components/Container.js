import container from 'styles/container';
import { createElement } from 'react';
import styled from 'styled-components';

const Container = styled(({ component = 'div', medium, slim, ...props }) => createElement(component, { ...props })) `${container}`;

export default Container;