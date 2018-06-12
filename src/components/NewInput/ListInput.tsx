import linkState from 'linkstate';
import { get, isFunction, map, set, trim } from 'lodash';
import React, { Component, FormEvent, HTMLProps } from 'react';
import slugify from 'slugify';
import styled from '../../util/styled-components';
import Lozenge from '../Lozenge';
import Field from './Field';
import FieldContainer from './FieldContainer';
import FieldLabel from './FieldLabel';
import Help from './Help';
import { InputProps, InputState } from './Input';
import Wrapper from './Wrapper';

const TagWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	padding: 4px 0;

	span {
		margin: 4px 8px 4px 0;

		:last-child {
			margin-right: 0;
		}
	}
`;

interface ListInputProps extends InputProps {
	value: string[];
}

interface ListInputState extends InputState {
	value: string;
}

export default class ListInput extends Component<ListInputProps & HTMLProps<HTMLInputElement>, ListInputState> {
	readonly state: ListInputState = {
		isFocus: false,
		value: ''
	};

	render () {
		const { children, help, label, prefix, ref, suffix, value, ...props } = this.props;
		const id = props.id || slugify(`field-${props.name || label || props.placeholder}`, { lower: true });
		const container = { appearance: props.appearance, disabled: props.disabled, ...this.state };
		const wrapper = { isCompact: props.isCompact };

		return (
			<Wrapper {...wrapper}>
				{label && <FieldLabel htmlFor={id} required={props.required}>{label}</FieldLabel>}
				<TagWrapper>
					{map(value, (item, i) => <Lozenge appearance="default" onClick={this.removeTag(i)}>{item}</Lozenge>)}
				</TagWrapper>
				<FieldContainer {...container}>
					{prefix}
					<Field
						{...props}
						id={id}
						onFocus={toggleState(this, 'isFocus', 'onFocus')}
						onBlur={toggleState(this, 'isFocus', 'onBlur')}
						onChange={linkState(this, 'value')}
						onKeyPress={this.onKeyPress}
						value={this.state.value}
					/>
					{suffix}
				</FieldContainer>
				{children}
				{help && <Help appearance="default">{help}</Help>}
			</Wrapper>
		);
	}

	private onKeyPress = (event) => {
		const { key, keyCode, which } = event;
		if (key === 'Enter' || keyCode === 13 || which === 13) {
			event.preventDefault();
			const { onChange } = this.props;
			const mockEvent: FormEvent<HTMLInputElement> = { ...event, target: { value: [ ...this.props.value, trim(this.state.value) ] } };
			if (onChange) onChange(mockEvent);
			this.setState({ value: '' });
		}
	}
	private removeTag = (index) => (event) => {
		const { onChange } = this.props;
		const mockEvent: FormEvent<HTMLInputElement> = { ...event, target: { value: [ ...this.props.value.slice(0, index), ...this.props.value.slice(index + 1) ] } };
		if (onChange) onChange(mockEvent);
	}
}

export const toggleState = (component, statePath: string, propName: string) => (event: React.SyntheticEvent<any>) => {
	component.setState(set({ ...component.state }, statePath, !get(component.state, statePath)));
	const prop = get(component, `props.${propName}`);
	if (isFunction(prop)) prop(event);
};
