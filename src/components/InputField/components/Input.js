import { h } from 'preact';
import styled from 'styled-components';

const Input = (props) => props.type === 'multiline' ? (
	<textarea {...props} />
) : (
	<input {...props} />
);

export default styled(Input)`
	display: block;
	flex: 0 0 100%;
	font-family: inherit;
	font-size: inherit;
	color: ${props => props.disabled ? 'rgba(0, 0, 0, 0.42)' : 'inherit'};
	border: none;
	padding: 7px 0 9px;
	background: none;
	resize: none;
`;