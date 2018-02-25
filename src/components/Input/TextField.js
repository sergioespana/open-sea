import { darken } from 'polished';
import React from 'react';
import slugify from 'slugify';
import styled from 'styled-components';

const TextInput = styled(({ fullWidth, inline, ...props }) => <input {...props} />)`
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
		background-color: ${({ disabled, inline, theme }) => disabled ? 'transparent' : inline ? theme.light : darken(0.05, theme.light)};
		border-color: ${({ disabled, inline, theme }) => disabled ? 'transparent' : inline ? theme.light : darken(0.05, theme.light)};
		cursor: text;
	}

	:focus {
		border-color: ${({ theme }) => theme.accent};
		background-color: #fff;
	}
`;

const Label = styled.label`
	font-size: 0.857rem;
	color: ${({ theme }) => theme.text.secondary};
	font-weight: 500;
	margin: 0 auto 0 0;
	padding-bottom: 3px;
	position: relative;

	&[required]:after {
		content: '*';
		position: absolute;
		top: 0;
		margin-left: 2px;
		color: red;
	}
`;

const Help = styled.div`
	color: ${({ theme }) => theme.text.secondary};
	font-size: 0.857rem;
	padding-top: 3px;
`;

const Wrapper = styled(({ ...props }) => <div {...props} />)`
	display: flex;
	flex-direction: column;
	width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};

	&:not(:last-of-type) {
		margin-bottom: 16px;
	}

	&:first-of-type {
		margin-top: 16px;
	}
`;

const TextField = styled(({ className, help, label, ...props }) => {
	if (help || label) {
		const id = props.id || slugify(label);

		return (
			<Wrapper className={className}>
				<Label htmlFor={id} required={props.required}>{ label }</Label>
				<TextInput {...props} id={id} />
				<Help>{ help }</Help>
			</Wrapper>
		);
	}

	return <TextInput {...props} className={className} />;
})``;

export default TextField;