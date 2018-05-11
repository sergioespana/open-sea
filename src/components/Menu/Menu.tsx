import React, { cloneElement, Component } from 'react';
import { Container, OptionsWrapper as SelectOptionsWrapper } from '../Input/SingleSelect';
export { Option as MenuOption } from '../Input/SingleSelect';

const OptionsWrapper = SelectOptionsWrapper.extend`
	h3 {
		font-weight: normal;
		padding: 8px 12px;
		white-space: nowrap;
	}
`;

interface Props {
	position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
	trigger: React.ReactElement<any>;
}
interface State {
	opened: boolean;
}
export default class Menu extends Component<Props, State> {
	state: State = {
		opened: false
	};

	outerWrapper = null;
	innerWrapper = null;

	componentDidMount () {
		window.addEventListener('click', this.onWindowClick);
	}

	componentWillUnmount () {
		window.removeEventListener('click', this.onWindowClick);
	}

	render () {
		const { children, position, trigger } = this.props;
		const { opened } = this.state;

		const TriggerComponent = cloneElement(trigger, { onClick: this.onClick });
		const positionStyle = getPositionStyle(position);

		return (
			<Container innerRef={this.setOuterWrapperRef}>
				{TriggerComponent}
				{opened && (
					<OptionsWrapper innerRef={this.setInnerWrapperRef} style={positionStyle}>
						{children}
					</OptionsWrapper>
				)}
			</Container>
		);
	}

	private onClick = () => this.setState(toggleOpenState);
	private onWindowClick = (event) => ((!(this.outerWrapper.contains(event.target) || event.target === this.outerWrapper) || this.innerWrapper.contains(event.target)) && this.state.opened) && this.setState(toggleOpenState);
	private setOuterWrapperRef = (element) => this.outerWrapper = element;
	private setInnerWrapperRef = (element) => this.innerWrapper = element;
}

export const toggleOpenState = (prevState: State) => ({ opened: !prevState.opened });
export const getPositionStyle = (position: string): object => {
	switch (position) {
	case 'top-left':
		return {};
	case 'top-right':
		return {};
	case 'bottom-right':
		return {
			top: 'auto',
			right: 'auto',
			bottom: 0,
			left: '100%',
			margin: '0 0 0 6px'
		};
	default:
		return {
			right: 0,
			left: 'auto'
		};
	}
};
