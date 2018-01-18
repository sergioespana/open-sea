import styled, {css } from 'styled-components';
import { darken } from 'polished';
import React from 'react';
import Select from './Select';
import slug from 'slugify';

const Wrapper = styled(({ ...props }) => <div {...props} />)`
	display: flex;
	flex-wrap: nowrap;
	padding: 4px 0;
	margin: 1px 0;
	color: ${({ theme }) => theme.text.secondary};
	font-size: 0.875rem;
`;
const labelStyles = css`
	padding: 5px 15px 0 0;
	flex: 0 0 120px;
	text-align: right;

	${({ required }) => required && `
		position: relative;

		:after {
			content: '*';
			position: absolute;
			top: 0;
			right: 8px;
			color: red;
		}
	`}
`;
const Label = styled(({ required, ...props }) => props.children ? <label {...props} /> : null)`${labelStyles}`;
const Legend = styled(({ required, ...props }) => props.children ? <legend {...props} /> : null)`${labelStyles}`;
const CheckboxLabel = styled(({ ...props }) => <label {...props} />)`
	color: ${({ theme }) => theme.text.primary};
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	min-height: 32px;

	& + p {
		margin-top: 0;
	}
`;
const ImageLabel = styled(({ ...props }) => <label {...props} />)`
	position: relative;
	width: 96px;
	height: 96px;

	img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		pointer-events: none;
	}

	div {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 3px;
		display: none;
		align-items: center;
		justify-content: center;
		padding: 10px;
		text-align: center;
		pointer-events: none;
	}

	input {
		display: none;
	}

	:hover {
		cursor: pointer;

		div {
			display: flex
		}
	}

	// FIXME: This doesn't work, can't focus the object through tabs for some reason.
	:focus {
		box-shadow: 0 0 0 2px ${({ theme }) => theme.accent};
	}
`;
const Vertical = styled(({ ...props }) => <div {...props} />)`
	flex: auto;
	display: flex;
	flex-direction: column;
`;
const Horizontal = styled(({ long, small, ...props }) => <div {...props} />)`
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	max-width: ${({ long, small }) => long ? 500 : small ? 100 : 300}px;
`;
const Prefix = styled(({ ...props }) => props.children ? <span {...props} /> : null)`
	background-color: ${({ theme }) => darken(0.075, theme.light)};
	border-radius: 3px 0 0 3px;
	min-height: 32px;
	padding: 0 14px 0 8px;
	line-height: 32px;
	font-family: inherit;
	font-size: inherit;
	color: ${({ theme }) => theme.text.primary};
	white-space: pre;

	& + input {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		margin-left: 2px;
	}
`;
const textFieldStyles = css`
	border: 1px solid #ccc;
	border-radius: 3px;
	min-height: 32px;
	width: 100%;
	padding: 4px 5px;
	line-height: 20px;
	font-family: inherit;
	font-size: inherit;
	color: ${({ theme }) => theme.text.primary};
	background-color: ${({ theme }) => theme.light};
	resize: vertical;
	overflow-x: hidden;
	position: relative;

	:focus {
		padding: 3px 4px;
		border: 2px solid ${({ theme }) => theme.accent};
		background-color: #fff;
	}

	&[required] {
		:before {
			content: '*';
			position: absolute;
			top: 0;
			left: 0;
		}
	}

	&[disabled] {
		cursor: no-drop;
	}
`;
const InputText = styled(({ ...props }) => <input {...props} />)`${textFieldStyles}`;
const InputTextArea = styled(({ ...props }) => <textarea cols={40} rows={4} {...props} />)`${textFieldStyles}`;
const InputCheckbox = styled(({ ...props }) => <input type="checkbox" {...props} />)`
	margin: 0 8px 0 0;
`;
const Help = styled(({ ...props }) => props.children ? <p {...props} /> : null)`
	font-size: 0.75rem;
	margin: 10px 0 0;
`;

const Input = (props) => {
	const { help, label, long, prefix, secondLabel, short, type, ...other } = props;
	const id = `field-${slug(label || props.placeholder, { remove: /[=`#%^$*_+~.()'"!\-:@]/g })}`;

	switch (type) {
		case 'checkbox': return (
			<Wrapper>
				<Legend required={props.required}>{ label }</Legend>
				<Vertical>
					<CheckboxLabel>
						<InputCheckbox {...other} />
						{ secondLabel }
					</CheckboxLabel>
					<Help>{ help }</Help>
				</Vertical>
			</Wrapper>
		);

		case 'image': return (
			<Wrapper>
				<Legend required={props.required}>{ label }</Legend>
				<Vertical>
					<ImageLabel>
						<img src={props.value || '/assets/images/organisation-avatar-placeholder.png'} />
						<div><span>Choose { label.toLowerCase() }</span></div>
						<input type="file" accept="image/*" {...other} value="" />
					</ImageLabel>
					<Help>{ help }</Help>
				</Vertical>
			</Wrapper>
		);

		case 'select': return (
			<Wrapper>
				<Legend required={props.required}>{ label }</Legend>
				<Vertical>
					<Select {...other} />
					<Help>{ help }</Help>
				</Vertical>
			</Wrapper>
		);

		case 'text': return (
			<Wrapper>
				<Label htmlFor={id} required={props.required}>{ label }</Label>
				<Vertical>
					<InputTextArea id={id} {...other} />
					<Help>{ help }</Help>
				</Vertical>
			</Wrapper>
		);
		
		default: return (
			<Wrapper>
				<Label htmlFor={id} required={props.required}>{ label }</Label>
				<Vertical>
					<Horizontal long={long} short={short}>
						<Prefix>{ prefix }</Prefix>
						<InputText id={id} type={type || 'text'} {...other} />
					</Horizontal>
					<Help>{ help }</Help>
				</Vertical>
			</Wrapper>
		);
	}
};

export default Input;