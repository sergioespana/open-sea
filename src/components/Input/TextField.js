import { darken } from 'polished';
import Help from './Help';
import Label from './Label';
import React from 'react';
import slugify from 'slugify';
import styled from 'styled-components';
import Wrapper from './Wrapper';

const TextInput = styled(({ fullWidth, inline, multiLine, ...props }) => multiLine ? <textarea {...props} /> : <input {...props} />)`
	border: 2px solid ${({ inline, theme }) => inline ? 'transparent' : theme.light};
	border-radius: 5px;
	width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
	max-width: ${({ fullWidth }) => fullWidth ? '100%' : '300px'};
	padding: 8px 7px;
	font-family: inherit;
	font-size: inherit;
	line-height: 20px;
	color: ${({ theme }) => theme.text.primary};
	background-color: ${({ inline, theme }) => inline ? 'transparent' : theme.light};
	resize: vertical;
	overflow-x: hidden;
	position: relative;
	transition: all 100ms ease-out;
	will-change: border-color, background-color;
	
	&::placeholder {
		color: ${({ theme }) => theme.text.secondary};
	}

	:hover {
		background-color: ${({ inline, theme }) => inline ? theme.light : darken(0.05, theme.light)};
		border-color: ${({ inline, theme }) => inline ? theme.light : darken(0.05, theme.light)};
	}

	:focus {
		border-color: ${({ theme }) => theme.accent};
		background-color: #fff;
	}

	&[disabled] {
		background-color: ${({ inline, theme }) => inline ? 'transparent' : theme.light};
		border-color: ${({ inline, theme }) => inline ? 'transparent' : theme.light};
		
		:hover {
			background-color: ${({ inline, theme }) => inline ? 'transparent' : theme.light};
			border-color: ${({ inline, theme }) => inline ? 'transparent' : theme.light};
			cursor: ${({ inline }) => inline ? 'text' : 'no-drop'};
		}
	}
`;

const TextField = styled(({ className, help, label, ...props }) => {
	if (help || label) {
		const id = props.id || slugify(label);

		return (
			<Wrapper className={className}>
				{ label && <Label htmlFor={id} required={props.required}>{ label }</Label> }
				<TextInput {...props} id={id} />
				{ help && <Help>{ help }</Help> }
			</Wrapper>
		);
	}

	return <TextInput {...props} className={className} />;
})``;

export default TextField;