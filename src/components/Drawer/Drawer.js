import React, { Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Transition from 'react-transition-group/Transition';

const Aside = styled.aside`
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	display: flex;
	z-index: 401;
	transition: transform 225ms ${({ visible }) => visible ? `cubic-bezier(0.4, 0, 0.2, 1)` : `cubic-bezier(0, 0, 0.2, 1)`};
	transform: ${({ visible }) => visible ? `translate3d(0, 0, 0)` : `translate3d(-100%, 0, 0)`};
`;

const Overlay = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 400;
	background-color: rgba(0, 0, 0, 0.54);
	transition: opacity 225ms ${({ visible }) => visible ? `cubic-bezier(0.4, 0, 0.2, 1)` : `cubic-bezier(0, 0, 0.2, 1)`};
	opacity: ${({ visible }) => visible ? 1 : 0};
`;

class Drawer extends Component {
	state = {
		visible: false
	}

	onEntered = () => {
		document.body.style.overflow = 'hidden';
		this.setState({ visible: true });
	}

	onExit = () => {
		document.body.style.overflow = null;
		this.setState({ visible: false });
	}

	render = () => {
		const { children, onRequestClose, open } = this.props;

		return createPortal((
			<Transition
				timeout={{ enter: 0, exit: 225 }}
				in={open}
				mountOnEnter
				unmountOnExit
				onEntered={this.onEntered}
				onExit={this.onExit}
			>
				<Fragment>
					<Aside {...this.state}>{ children }</Aside>
					<Overlay {...this.state} onClick={onRequestClose} />
				</Fragment>
			</Transition>
		), document.body);
	};
}

export default Drawer;