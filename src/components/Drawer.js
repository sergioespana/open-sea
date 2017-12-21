import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Transition from 'react-transition-group/Transition';

const Overlay = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.54);
	z-index: 10;
	transition: opacity 225ms ${({ visible }) => visible ? `cubic-bezier(0.4, 0, 0.2, 1)` : `cubic-bezier(0, 0, 0.2, 1)`};
	opacity: ${({ visible }) => visible ? 1 : 0};
`;

const Aside = styled.aside`
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	width: ${({ wide }) => wide ? 550 : 350}px;
	z-index: 11;
	display: flex;
	transition: transform 225ms ${({ visible }) => visible ? `cubic-bezier(0.4, 0, 0.2, 1)` : `cubic-bezier(0, 0, 0.2, 1)`};
	transform: ${({ visible }) => visible ? `translate3d(0, 0, 0)` : `translate3d(-100%, 0, 0)`};
`;

export const DrawerInput = styled.input`
	width: 100%;
	height: 40px;
	border: none;
	font-family: inherit;
	font-size: 1.2rem;
`;

const DrawerComponent = ({ children, onRequestClose, visible, wide, ...props }) => (
	<React.Fragment>
		<Overlay onClick={onRequestClose ? onRequestClose : null} visible={visible} />
		<Aside wide={wide} visible={visible}>{ children }</Aside>
	</React.Fragment>
)

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

	render() {
		const { open, ...props } = this.props;

		const CompToRender = (
			<Transition
				timeout={{ enter: 0, exit: 225 }}
				in={open}
				mountOnEnter
				unmountOnExit
				onEntered={this.onEntered}
				onExit={this.onExit}
			>
				<DrawerComponent {...this.state} {...props} />
			</Transition>
		);

		return createPortal(CompToRender, document.body);
	}
}

export default Drawer;