import React, { Component } from 'react';
import find from 'lodash/find';
import Fuse from 'fuse.js';
import isFunction from 'lodash/isFunction';
import linkState from 'linkstate';
import map from 'lodash/map';
import MdExpandMore from 'react-icons/lib/md/expand-more';
import pick from 'lodash/pick';
import styled from 'styled-components';
import TextField from './TextField';
import trim from 'lodash/trim';

const isBlank = (str) => !trim(str);

const Label = styled(({ ...props }) => <label {...props} />)`
	background: none;
	border: none;
	position: absolute;
	right: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	width: 36px;
	height: 100%;

	:hover {
		cursor: pointer;
	}

	svg {
		color: ${({ theme }) => theme.text.primary};
	}

	&[disabled] {
		pointer-events: none;
	}
`;

const Input = TextField.extend`
	padding-right: 36px;
`;

const Wrapper = styled.div`
	position: relative;
`;

const Option = styled.div`
	padding: 8px 12px;
	color: ${({ theme }) => theme.text.primary};

	&:not([disabled]):hover {
		cursor: pointer;
		background-color: ${({ theme }) => theme.light};
	}

	&[disabled] {
		cursor: text;
	}
`;

const OptionsWrapper = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	top: 100%;
	background-color: #ffffff;
	border-radius: 3px;
	box-shadow: 0 4px 8px -2px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31);
	padding: 4px 0;
	margin: 6px 0 0 0;
	overflow: auto;
`;

class Select extends Component {
	state = {
		query: '',
		open: false,
		options: [],
		ignoreClick: true
	}

	inputField = null;
	wrapper = null;

	onFocus = () => {
		this.setState({ open: true });
		window.addEventListener('click', this.handleWindowClick);
	};
	
	handleWindowClick = (event) => {
		const { ignoreClick } = this.state;
		if (ignoreClick) return this.setState({ ignoreClick: false });

		if (this.wrapper.contains(event.target) || event.target === this.wrapper) return;

		this.setState({ open: false, ignoreClick: true });
		window.removeEventListener('click', this.handleWindowClick);
	}

	handleOptionClick = (value) => (event) => {
		if (value) {
			const { onChange } = this.props;
			if (isFunction(onChange)) onChange({ target: { value } });
			return this.setState({ open: false, query: this.findLabelForValue(value) });
		}

		return this.setState({ open: false, query: this.findLabelForValue(this.props.value) });
	}

	findLabelForValue = (value) => {
		const { options } = this.state;
		return (find(options, { value }) || {}).label || '';
	}

	componentWillMount = () => {
		const { children } = this.props;
		const options = map(children, ({ props: { value, children } }) => ({ value, label: children }));
		// TODO: Make Fuse more strict
		return this.setState({ options, searchable: new Fuse(options, { keys: ['label'], threshold: 0.3 }) });
	}

	render = () => {
		const { query, open, searchable } = this.state;
		const { value, ...props } = this.props;

		const inputProps = pick(props, 'fullWidth', 'disabled', 'placeholder', 'label', 'help');
		const options = isBlank(query) ? this.state.options : searchable.search(query);

		return (
			// eslint-disable-next-line react/jsx-no-bind
			<Wrapper innerRef={(el) => this.wrapper = el}>
				<Input
					{...inputProps}
					value={open ? query : (find(options, { value }) || {}).label || ''}
					onChange={linkState(this, 'query')}
					onFocus={this.onFocus}
					id="test"
				/>
				<Label htmlFor="test" disabled={inputProps.disabled}><MdExpandMore width={24} height={24} /></Label>
				<OptionsWrapper hidden={!open}>
					{ options.length > 0
						? map(options, ({ label, value }) => (
							<Option
								key={value}
								onClick={this.handleOptionClick(value)}
							>{ label }</Option>))
						: <Option onClick={this.handleOptionClick()} disabled>No options</Option>
					}
				</OptionsWrapper>
			</Wrapper>
		);
	}
}

export default Select;