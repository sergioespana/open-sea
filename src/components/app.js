import { h, Component } from 'preact';
import styled from 'styled-components';
import Dropzone from './Dropzone';

const App = ({ children, ...props }) => (
	<Dropzone {...props}>{ children }</Dropzone>
);

export default styled(App)`
	min-height: 100vh;
`;