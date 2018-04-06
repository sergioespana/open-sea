import { isUndefined, map } from 'lodash';
import React, { Component, HTMLProps } from 'react';
import MdClose from 'react-icons/lib/md/close';
import MdExpandMore from 'react-icons/lib/md/expand-more';
import { LinkProps } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../Button';
import { Link } from '../Link';

interface Option {
	to?: LinkProps['to'];
	value?: Function;
}

interface Props extends HTMLProps<HTMLSelectElement> {
	options: Option[];
	resetLocation?: LinkProps['to'];
	value?: string;
}

interface State {
	opened: boolean;
}

const Container = styled.div`
	display: inline;
	position: relative;
`;

const ToggleButton = Button.extend`
	padding: 0 6px;

	:focus {
		background-color: #ffffff;
		border-color: ${({ theme }) => theme.accent};
		color: inherit;
	}

	& > svg {
		margin: 0 0 0 12px;
	}
`;

const OptionsWrapper = styled.div`
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

const Option = styled(Link)`
	color: inherit;
	display: block;
	padding: 8px 12px;
	white-space: nowrap;

	&:not([disabled]):hover {
		color: inherit;
		cursor: pointer;
		background-color: ${({ theme }) => theme.light};
		text-decoration: none;
	}

	&[disabled] {
		cursor: text;
	}
`;

export default class FilterSelect extends Component<Props, State> {
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
		const { label, options, resetLocation, value } = this.props;
		const { opened } = this.state;

		return (
			<Container innerRef={this.setInnerRef}>
				<ToggleButton
					appearance="subtle"
					onMouseDown={value ? undefined : this.onMouseDown}
					to={value ? resetLocation : undefined}
				>
					{value || label}
					{isUndefined(value) || opened ? <MdExpandMore height={16} width={16} /> : <MdClose height={16} width={16} />}
				</ToggleButton>
				{opened && (
					<OptionsWrapper>
						{map(options, ({ to, value }: Option) => (
							<Option
								onClick={this.onMouseDown}
								to={to}
							>
								{value}
							</Option>
						))}
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
