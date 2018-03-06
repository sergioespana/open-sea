import { darken, textInputs } from 'polished';
import React, { createElement, Component } from 'react';
import Help from './Help';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import Label from './Label';
import Prefix from './Prefix';
import slugify from 'slugify';
import styled from 'styled-components';
// import Wrapper from './Wrapper';

// const TextInput = styled(({ fullWidth, inline, multiLine, ...props }) => multiLine ? <textarea {...props} /> : <input {...props} />)`
// 	border: 2px solid ${({ inline, theme }) => inline ? 'transparent' : theme.light};
// 	border-radius: 5px;
// 	width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
// 	max-width: ${({ fullWidth }) => fullWidth ? '100%' : '300px'};
// 	padding: 8px 7px;
// 	font-family: inherit;
// 	font-size: inherit;
// 	line-height: 20px;
// 	color: ${({ theme }) => theme.text.primary};
// 	background-color: ${({ inline, theme }) => inline ? 'transparent' : theme.light};
// 	resize: vertical;
// 	overflow-x: hidden;
// 	position: relative;
// 	transition: all 100ms ease-out;
// 	will-change: border-color, background-color;
	
// 	&::placeholder {
// 		color: ${({ theme }) => theme.text.secondary};
// 	}

// 	:hover {
// 		background-color: ${({ inline, theme }) => inline ? theme.light : darken(0.05, theme.light)};
// 		border-color: ${({ inline, theme }) => inline ? theme.light : darken(0.05, theme.light)};
// 	}

// 	:focus {
// 		border-color: ${({ theme }) => theme.accent};
// 		background-color: #fff;
// 	}

// 	&[disabled] {
// 		background-color: ${({ inline, theme }) => inline ? 'transparent' : theme.light};
// 		border-color: ${({ inline, theme }) => inline ? 'transparent' : theme.light};
		
// 		:hover {
// 			background-color: ${({ inline, theme }) => inline ? 'transparent' : theme.light};
// 			border-color: ${({ inline, theme }) => inline ? 'transparent' : theme.light};
// 			cursor: ${({ inline }) => inline ? 'text' : 'no-drop'};
// 		}
// 	}
// `;

// const TextField = styled(({ className, help, label, ...props }) => {
// 	if (help || label) {
// 		const id = props.id || slugify(label);

// 		return (
// 			<Wrapper className={className}>
// 				{ label && <Label htmlFor={id} required={props.required}>{ label }</Label> }
// 				<TextInput {...props} id={id} />
// 				{ help && <Help>{ help }</Help> }
// 			</Wrapper>
// 		);
// 	}

// 	return <TextInput {...props} className={className} />;
// })``;

const Container = styled(({ compact, hasFocus, hasPrefix, hasSuffix, isDisabled, isInlineEdit, ...props }) => <div disabled={isDisabled} {...props} />)`
	position: relative;
	width: 100%;
	max-width: ${({ compact }) => compact ? '300px' : '100%'};
	border: 2px solid ${({ hasFocus, isInlineEdit, theme }) => hasFocus ? theme.accent : isInlineEdit ? 'transparent' : theme.light};
	border-radius: 5px;
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	background-color: ${({ hasFocus, isInlineEdit, theme }) => hasFocus || isInlineEdit ? '#ffffff' : theme.light};
	transition: all 200ms ease-out;
	will-change: background-color, border-color;

	:hover,
	:hover input {
		cursor: text;
	}

	&:not([disabled]):hover,
	&[disabled="false"]:hover {
		background-color: ${({ hasFocus, isInlineEdit, theme }) => hasFocus ? '#ffffff' : isInlineEdit ? theme.light : darken(0.05, theme.light)};
		border-color: ${({ hasFocus, isInlineEdit, theme }) => hasFocus ? theme.accent : isInlineEdit ? theme.light : darken(0.05, theme.light)};
	}

	${textInputs()} {
		border: none;
		width: 100%;
		height: 100%;
		padding: ${({ hasPrefix, hasSuffix }) => `8px ${hasSuffix ? 0 : 7}px 8px ${hasPrefix ? 0 : 7}px`};
		font-family: inherit;
		font-size: inherit;
		line-height: 20px;
		color: ${({ theme }) => theme.text.primary};
		background-color: transparent;
	}
`;

const TextField = styled(class TextField extends Component {
	state = {
		hasFocus: false
	}

	input = null;

	onFocus = (event) => {
		const { onFocus } = this.props;
		if (isFunction(onFocus)) onFocus(event);
		this.setState({ hasFocus: true });
	}

	onBlur = (event) => {
		const { onBlur } = this.props;
		if (isFunction(onBlur)) onBlur(event);
		this.setState({ hasFocus: false });
	}

	onClick = () => this.input.focus();

	componentWillMount = () => {
		const { id, label } = this.props;
		if (id) return this.setState({ id });
		if (label) return this.setState({ id: slugify(`field-${label}`, { lower: true }) });
		return this.setState({ id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 12) });
	}

	render = () => {
		const { className, compact, help, isInlineEdit, label, multiLine, prefix, suffix, ...props } = this.props;
		const { hasFocus, id } = this.state;
		
		return (
			<div className={className}>
				{ label && <Label htmlFor={id} required={props.required}>{ label }</Label> }
				<Container
					compact={compact}
					hasPrefix={!isUndefined(prefix)}
					hasSuffix={!isUndefined(suffix)}
					hasFocus={hasFocus}
					isDisabled={props.disabled}
					isInlineEdit={isInlineEdit}
					onBlur={this.onBlur}
					onFocus={this.onFocus}
					onClick={this.onClick}
				>
					{ isString(prefix) ? <Prefix>{ prefix }</Prefix> : prefix }
					{ createElement(multiLine ? 'textarea' : 'input', {
						type: 'text',
						ref: (element) => this.input = element,
						...props,
						id
					}) }
					{ suffix }
				</Container>
				{ help && <Help>{ help }</Help> }
			</div>
		);
	}
})`
	width: 100%;
`;

export default TextField;