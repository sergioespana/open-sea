import { pick } from 'lodash';
import { darken } from 'polished';
import React, { Component, HTMLProps } from 'react';
import slugify from 'slugify';
import styled from '../../util/styled-components';

interface WrapperProps {
	compact?: Props['compact'];
}
const UnstyledWrapper: React.StatelessComponent<WrapperProps> = (props) => <div {...props} />;
const Wrapper = styled(UnstyledWrapper)`
	${({ compact }) => compact && 'max-width: 300px;'}
	width: 100%;
`;

const UnstyledLabel: React.StatelessComponent<HTMLProps<HTMLLabelElement>> = (props) => <label {...props} />;
export const Label = styled(UnstyledLabel)`
	color: ${({ theme }) => theme.text.secondary};
	font-size: 0.857rem;
	font-weight: 500;
	margin: 0px auto 0px 0px;
	padding: 0 0 3px 7px;
	position: relative;

	&[required]:not([required="false"]) {
		:after {
			color: ${({ theme }) => theme.red};
			content: '*';
			left: 103%;
			position: absolute;
		}
	}
`;

const Help = styled.p`
	color: ${({ theme }) => theme.text.secondary};
	font-size: 0.875rem;
	margin: 3px 0 0;
`;

interface ContainerProps extends State {
	appearance: Props['appearance'];
	disabled?: Props['disabled'];
}
const UnstyledInputContainer: React.StatelessComponent<ContainerProps> = (props) => <div {...props} />;
const InputContainer = styled(UnstyledInputContainer)`
	align-items: center;
	background-color: ${({ appearance, focused, theme }) => appearance === 'inline' || focused ? '#ffffff' : theme.light};
	border-color: ${({ focused, theme }) => focused ? theme.accent : 'transparent'};
	border-radius: 5px;
	border-style: solid;
	border-width: 2px;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	position: relative;
	transition: all 200ms ease;
	width: 100%;
	will-change: background-color, border-color;

	:hover {
		background-color: ${({ appearance, disabled, focused, theme }) => (appearance === 'inline' && disabled) || focused ? '#ffffff' : appearance === 'inline' && !disabled ? theme.light : darken(0.05, theme.light)};
	}

	& > svg {
		height: 24px;
		margin: 0 14px;
		width: 24px;

		& + input {
			padding-left: 0;
		}
	}

	& > input + svg {
		margin-left: 7px;
	}
`;

interface InputProps extends HTMLProps<HTMLInputElement> {
	appearance: Props['appearance'];
	disabled?: Props['disabled'];
}

const UnstyledInput: React.StatelessComponent<InputProps> = (props) => <input {...props} />;
const Input = styled(UnstyledInput) `
	background-color: transparent;
	border: none;
	color: ${({ theme }) => theme.text.primary};
	font-family: inherit;
	font-size: inherit;
	padding: 8px 7px;
	resize: none;
	width: 100%;

	:hover {
		cursor: text;
	}

	:focus {
		outline: none;
	}

	&::placeholder {
		color: ${({ theme }) => theme.text.secondary};
		${({ appearance, disabled }) => (appearance === 'inline' && disabled) && 'font-style: italic;'}
		opacity: 1;
	}
`;

interface TextAreaProps extends HTMLProps<HTMLTextAreaElement> {
	appearance: Props['appearance'];
	disabled?: Props['disabled'];
}
const UnstyledTextArea: React.StatelessComponent<TextAreaProps> = (props) => <textarea {...props} />;
const TextArea = styled(UnstyledTextArea)`
	background-color: transparent;
	border: none;
	color: ${({ theme }) => theme.text.primary};
	font-family: inherit;
	font-size: inherit;
	padding: 8px 7px;
	resize: none;
	width: 100%;

	:hover {
		cursor: text;
	}

	:focus {
		outline: none;
	}

	&::placeholder {
		color: ${({ theme }) => theme.text.secondary};
		${({ appearance, disabled }) => (appearance === 'inline' && disabled) && 'font-style: italic;'}
		opacity: 1;
	}
`;

interface Props extends HTMLProps<any> {
	appearance: 'default' | 'error' | 'inline' | 'warning';
	childrenAfterInput?: boolean;
	compact?: boolean;
	help?: string;
	label?: string;
	prefixElement?: JSX.Element;
	suffixElement?: JSX.Element;
}

interface State {
	focused: boolean;
}

export default class TextField extends Component<Props, State> {
	readonly state: State = {
		focused: false
	};

	render () {
		const { children, childrenAfterInput, help, label, prefixElement, required, suffixElement, ...props } = this.props;
		const id = this.props.id || slugify(`field-${this.props.name || label || this.props.placeholder}`, { lower: true });

		const wrapperProps = { ...pick(this.props, 'compact') };
		const containerProps = { ...this.state, ...pick(this.props, 'appearance', 'disabled') };
		const inputProps = { id, rows: 5, ...props }; // FIXME: This is wrong // TODO: Check if it is though
		const labelProps = { htmlFor: id, required };

		const InputComponent = props.multiple ? TextArea : Input;

		return (
			<Wrapper {...wrapperProps}>
				{!childrenAfterInput && children}
				{label && <Label {...labelProps}>{label}</Label>}
				<InputContainer {...containerProps}>
					{prefixElement}
					<InputComponent
						{...inputProps}
						onFocus={this.onFocus}
						onBlur={this.onBlur}
					/>
					{suffixElement}
				</InputContainer>
				{help && <Help>{help}</Help>}
				{childrenAfterInput && children}
			</Wrapper>
		);
	}

	private onFocus = () => this.setState(setFocusState(true));
	private onBlur = (event) => document.activeElement !== event.target && this.setState(setFocusState(false));
}

export const setFocusState = (val: boolean) => () => ({ focused: val });
