import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Transition from 'react-transition-group/Transition';

const Base = styled(({ visible, ...props }) => <div {...props} />)`
	display: flex;
	flex-direction: row;
	align-items: center;
	position: fixed;
	z-index: 350;
	bottom: 0;
	left: 0;
	width: 100vw;
	min-height: 48px;
	max-height: 112px;
	padding: 14px 24px; // TODO: top and bottom padding should be 24px when message spans across multiple lines
	font-size: 0.875rem;
	font-weight: 400;
	color: #ffffff;
	background-color: #323232;
	transform: ${({ visible }) => visible ? `translate3d(0, 0, 0)` : `translate3d(0, 100%, 0)`};
	transition: box-shadow 225ms cubic-bezier(0.4, 0, 0.2, 1), transform 225ms ${({ visible }) => visible ? `cubic-bezier(0.4, 0, 0.2, 1)` : `cubic-bezier(0, 0, 0.2, 1)`};

	@media (min-width: 601px) {
		width: auto;
		min-width: 288px;
		max-width: 568px;
		border-radius: 2px;
		left: 50%;
		transform: ${({ visible }) => visible ? `translate3d(-50%, 0, 0)` : `translate3d(-50%, 100%, 0)`};
	}
`;

@inject(app('VisualStore'))
@observer
class Snackbar extends Component {
	state = {
		visible: false
	}

	onEntered = () => this.setState({ visible: true });

	onExit = () => this.setState({ visible: false });

	render = () => {
		const { state, VisualStore } = this.props;
		const { snackbar } = state;

		return createPortal((
			<Transition
				timeout={{ enter: 0, exit: 225 }}
				in={snackbar.open}
				mountOnEnter
				unmountOnExit
				onEntered={this.onEntered}
				onExit={this.onExit}
			>
				<Base {...this.state}>{ snackbar.message }</Base>
			</Transition>
		), document.body);
	}
}

export default Snackbar;