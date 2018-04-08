import { get, isFunction, set } from 'lodash';
import React, { Component, HTMLProps } from 'react';
import slugify from 'slugify';
import Area from './Area';
import Container from './Container';
import FieldLabel from './FieldLabel';
import Help from './Help';
import { InputProps, InputState } from './Input';
import Wrapper from './Wrapper';

export default class TextArea extends Component<InputProps & HTMLProps<HTMLTextAreaElement>, InputState> {
	readonly state: InputState = {
		isFocus: false
	};

	render () {
		const { children, help, label, prefix, ref, suffix, ...props } = this.props;
		const id = props.id || slugify(`field-${props.name || label || props.placeholder}`, { lower: true });
		const container = { appearance: props.appearance, disabled: props.disabled, ...this.state };
		const wrapper = { isCompact: props.isCompact };

		return (
			<Wrapper {...wrapper}>
				{label && <FieldLabel htmlFor={id} required={props.required}>{label}</FieldLabel>}
				<Container {...container}>
					{prefix}
					<Area
						{...props}
						id={id}
						onFocus={toggleState(this, 'isFocus', 'onFocus')}
						onBlur={toggleState(this, 'isFocus', 'onBlur')}
						rows={props.rows || 5}
					/>
					{suffix}
				</Container>
				{children}
				{help && <Help>{help}</Help>}
			</Wrapper>
		);
	}
}

export const toggleState = (component, statePath: string, propName: string) => (event: React.SyntheticEvent<any>) => {
	component.setState(set({ ...component.state }, statePath, !get(component.state, statePath)));
	const prop = get(component, `props.${propName}`);
	if (isFunction(prop)) prop(event);
};
