import React, { Component } from 'react';
import find from 'lodash/find';
import isFunction from 'lodash/isFunction';
import map from 'lodash/map';
import { mix } from 'polished';
import styled from 'styled-components';

const Select = styled.ul`
	min-width: 250px;
	max-width: ${({ long, small }) => long ? 500 : small ? 100 : 300}px;
	min-height: 32px;
	color: ${({ theme }) => theme.text.primary};
	background-color: ${({ theme }) => theme.light};
	border-radius: 3px;
	padding: 0 0 0 5px;
	border: none;
	font-family: inherit;
	font-size: inherit;
	list-style: none;
	margin: 0;
	position: relative;
	display: flex;
	align-items: center;

	:hover {
		cursor: pointer;
	}

	&[open] {
		color: ${({ theme }) => theme.text.contrast};
		background-color: ${({ theme }) => theme.primary};
	}

	span {
		flex: auto;
	}

	i {
		flex: 0 0 24px;
		height: 100%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;

		:after {
			content: '';
			width: 6px;
			height: 6px;
			border: none;
			border-right: 2px solid;
			border-top: 2px solid;
			transform: rotate(135deg);
		}
	}

	div {
		position: absolute;
		top: 100%;
		right: 0;
		left: 0;
		margin: 4px 0 0 0;
		padding: 5px 0;
		border-radius: 3px;
		background-color: #ffffff;
		box-shadow: 0 4px 8px -2px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31);
		z-index: 5;
		
		li {
			background-color: #fff;
			font-family: inherit;
			font-size: inherit;
			border: none;
			height: 28px;
			display: flex;
			align-items: center;
			padding: 0 8px;
			color: ${({ theme }) => theme.text.primary};

			:hover {
				background-color: ${({ theme }) => theme.light};
			}
		}
	}

	:not([open]) div {
		display: none;
	}
`;

class SelectComponent extends Component {
	state = {
		firstClick: true,
		open: false
	}

	getText = (value) => (find(this.props.options, (obj) => obj.value === value) || {}).text;

	handleOptionSelect = ({ target: { dataset: { value } } }) => {
		if (isFunction(this.props.onChange)) this.props.onChange({ target: { value } });
	}

	handleClick = (event) => {
		const { firstClick } = this.state;
		if (firstClick) this.setState({ firstClick: !firstClick });
		else this.setState({ firstClick: !firstClick, open: false });
	}
	
	toggle = () => {
		const { open } = this.state;
		if (open) window.removeEventListener('click', this.handleClick);
		else window.addEventListener('click', this.handleClick);
		this.setState({ firstClick: true, open: !open });
	}

	render() {
		const { options, value, ...props } = this.props;

		return (
			<Select {...props} {...this.state} onClick={this.toggle}>
				<span>{ this.getText(value) }</span>
				<i />
				<div>
					<li data-value="" onClick={this.handleOptionSelect} />
					{ map(options, ({ text, value }, key) => <li key={key} data-value={value} onClick={this.handleOptionSelect}>{ text }</li>) }
				</div>
			</Select>
		);
	}
}

export default SelectComponent;