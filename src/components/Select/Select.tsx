import { find } from 'lodash';
import React, { HTMLProps, SFC } from 'react';
import MdExpandMore from 'react-icons/lib/md/expand-more';
import ReactSelect, { SelectProps } from 'react-select';
import slugify from 'slugify';
import styled from '../../util/styled-components';
import FieldLabel from '../NewInput/FieldLabel';
import Wrapper from '../NewInput/Wrapper';
import Container from './Container';
import Menu from './Menu';
import Option from './Option';

export const DropdownIndicator = styled(MdExpandMore)`
	height: 20px;
	margin: 7.32px;
	width: 20px;
`;

export interface SelectOption {
	icon?: React.ReactNode;
	label: string;
	subLabel?: string;
	value: string | number;
}

export interface SelectProps {
	options?: SelectOption[];
}

export const Select: SFC<SelectProps & HTMLProps<HTMLSelectElement>> = (props) => {
	const { components: propComponents, isCompact, label, value } = props;
	const id = props.id || slugify(`field-${props.name || label || props.placeholder}`, { lower: true });

	const components = {
		Control: (props) => {
			const { children, innerProps, isDisabled: disabled, isFocused, selectProps: { isSearchable } } = props;
			const otherProps = { disabled, isFocused, isFocus: isFocused, isSearchable }; // TODO: Replace "isFocus" with "isFocused"
			return <Container {...innerProps} {...otherProps}>{children}</Container>;
		},
		DropdownIndicator: ({ innerProps }) => <DropdownIndicator {...innerProps} />,
		IndicatorSeparator: () => null,
		Menu,
		Option
	};

	return (
		<Wrapper isCompact={isCompact}>
			{label && <FieldLabel htmlFor={id} required={props.required}>{label}</FieldLabel>}
			<ReactSelect
				isClearable={false}
				isSearchable={false}
				tabSelectsValue
				placeholder={null}
				{...props}
				components={{ ...components, ...propComponents }}
				id={id}
				inputId={id}
				value={find(props.options, { value })}
			/>
		</Wrapper>
	);
};

export default Select;
