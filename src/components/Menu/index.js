import { h } from 'preact';
import styled from 'styled-components';

import Wrapper from './components/Wrapper';
import Item from './components/Item';

const Menu = ({ children, ...props }) => (
	<Wrapper {...props}>{ children }</Wrapper>
);

export {
	Item as MenuItem
};
export default Menu;