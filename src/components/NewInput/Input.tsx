import { get, isFunction, set } from 'lodash';
import React, { Component, HTMLProps } from 'react';
import slugify from 'slugify';
import Container from './Container';
import Field from './Field';
import FieldLabel from './FieldLabel';
import Help from './Help';
import Wrapper from './Wrapper';

export interface InputProps {
	appearance: 'default' | 'error' | 'inline' | 'warning';
	help?: string;
	isCompact?: boolean;
	label?: string;
	prefix?: React.ReactNode;
	suffix?: React.ReactNode;
}

export interface InputState {
	isFocus: boolean;
}

export default class Input extends Component<InputProps & HTMLProps<HTMLInputElement>, InputState> {
	readonly state: InputState = {
		isFocus: false
	};

	render () {
		const { children, help, label, prefix, ref, suffix, ...props } = this.props;
		const id = props.id || slugify(`field-${props.name || label || props.placeholder}`, { lower: true });
		const container = { appearance: props.appearance, disabled: props.disabled, ...this.state };
		const wrapper = { isCompact: props.isCompact };

		switch (props.type) {
		case 'checkbox':
			return (
				<Wrapper {...wrapper}>
					<label>
						<input {...props} />
						<span>{label}</span>
					</label>
					{help && <Help>{help}</Help>}
				</Wrapper>
			);
		case 'file':
			return <input {...props} />;
		case 'radio':
			return <input {...props} />;
		case 'range':
			return <input {...props} />;
		default:
			return (
				<Wrapper {...wrapper}>
					{label && <FieldLabel htmlFor={id} required={props.required}>{label}</FieldLabel>}
					<Container {...container}>
						{prefix}
						<Field
							{...props}
							id={id}
							onFocus={toggleState(this, 'isFocus', 'onFocus')}
							onBlur={toggleState(this, 'isFocus', 'onBlur')}
						/>
						{suffix}
					</Container>
					{children}
					{help && <Help>{help}</Help>}
				</Wrapper>
			);
		}
	}
}

export const toggleState = (component, statePath: string, propName: string) => (event: React.SyntheticEvent<any>) => {
	component.setState(set({ ...component.state }, statePath, !get(component.state, statePath)));
	const prop = get(component, `props.${propName}`);
	if (isFunction(prop)) prop(event);
};
