import { h, Component } from 'preact';
import styled from 'styled-components';
import Dropzone from './Dropzone';

const App = ({ children, ...props }) => (
	<Dropzone {...props}>{ children }</Dropzone>
);

export default styled(App)`
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	min-height: 100vh;
`;