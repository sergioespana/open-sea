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

const Expander = styled(({ ...props }) => <MdExpandMore {...props} />)`
	width: 24px;
	height: 24px;
	box-sizing: content-box;
	padding: 4px 8px;
	cursor: pointer;
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
	z-index: 10;
	background-color: #ffffff;
	border-radius: 3px;
	box-shadow: 0 4px 8px -2px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31);
	padding: 4px 0;
	margin: 6px 0 0 0;
	overflow: auto;
`;

const Select = styled(class Select extends Component {
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
		const { className, value, ...props } = this.props;

		const inputProps = pick(props, 'compact', 'disabled', 'help', 'label', 'placeholder', 'required');
		const options = isBlank(query) ? this.state.options : searchable.search(query);

		return (
			<div
				// eslint-disable-next-line react/jsx-no-bind
				ref={(el) => this.wrapper = el}
				className={className}
			>
				<TextField
					{...inputProps}
					value={open ? query : (find(options, { value }) || {}).label || ''}
					onChange={linkState(this, 'query')}
					onFocus={this.onFocus}
					suffix={<Expander />}
				/>
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
			</div>
		);
	}
})`
	position: relative;
	width: 100%;
	max-width: ${({ compact }) => compact ? '300px' : '100%'};
`;

export default Select;