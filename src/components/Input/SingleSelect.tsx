import { find, get, map } from 'lodash';
import { darken } from 'polished';
import React, { Component, createElement, HTMLProps } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { LinkProps } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../Button';
import { Link } from '../Link';

interface Option {
	value: string | number;
	label: string;
}

interface Props extends HTMLProps<HTMLSelectElement> {
	options: Option[];
	value?: string;
}

interface State {
	opened: boolean;
}

export const Container = styled.div`
	display: inline-block;
	position: relative;
`;

const ToggleButton = Button.extend`
	background-color: ${({ theme }) => theme.light};
	padding: 0 6px;

	:hover {
		background-color: ${({ theme }) => darken(0.05, theme.light)};
	}

	:focus {
		background-color: ${({ theme }) => theme.muted};
		border-color: transparent !important;
		color: #ffffff;
	}

	& > svg {
		margin: 0 0 0 12px;
	}
`;

export const OptionsWrapper = styled.div`
	background-color: #ffffff;
	border-radius: 3px;
	box-shadow: 0 4px 8px -2px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31);
	left: 0;
	margin: 6px 0 0 0;
	min-width: 100%;
	overflow: auto;
	padding: 4px 0;
	position: absolute;
	top: 100%;
	z-index: 10;
`;

interface OptionProps extends LinkProps {}
export const Option = styled<OptionProps, any>((props: OptionProps) => createElement(props.to ? Link : 'button', props))`
	background-color: transparent;
	color: ${({ theme }) => theme.text.primary};
	display: block;
	font-family: inherit;
	font-size: inherit;
	padding: 8px 12px;
	text-align: left;
	white-space: nowrap;
	width: 100%;

	&:not([disabled]):hover {
		color: ${({ theme }) => theme.text.primary};
		cursor: pointer;
		background-color: ${({ theme }) => theme.light};
		text-decoration: none;
	}

	&[disabled] {
		cursor: text;
	}
`;

export default class SingleSelect extends Component<Props, State> {
	readonly state: State = {
		opened: false
	};

	wrapper = null;

	componentDidMount () {
		window.addEventListener('mousedown', this.onWindowClick);
	}

	componentWillUnmount () {
		window.removeEventListener('mousedown', this.onWindowClick);
	}

	render () {
		const { label, options, value } = this.props;
		const { opened } = this.state;

		return (
			<Container innerRef={this.setInnerRef}>
				<ToggleButton
					appearance="subtle"
					onMouseDown={this.onMouseDown}
				>
					{get(find(options, { value }), 'label') || label}
					<MdExpandMore height={16} width={16} />
				</ToggleButton>
				{opened && (
					<OptionsWrapper>
						{map(options, ({ value }: Option) => <Option onClick={this.onMouseDown}>{get(find(options, { value }), 'label')}</Option>)}
					</OptionsWrapper>
				)}
			</Container>
		);
	}

	private onMouseDown = () => this.setState(toggleOpenState);

	private onWindowClick = (event) => (!(this.wrapper.contains(event.target) || event.target === this.wrapper) && this.state.opened) && this.setState(toggleOpenState);

	private setInnerRef = (element) => this.wrapper = element;
}

export const toggleOpenState = (prevState: State) => ({ opened: !prevState.opened });
