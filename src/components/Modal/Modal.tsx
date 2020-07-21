import React, { Component, SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';
import Transition from 'react-transition-group/Transition';
import Overlay from '../FullscreenOverlay';
import Wrapper from './Wrapper';

interface ModalProps {
	isOpen?: boolean;
	onClose?: (event: SyntheticEvent<any>) => void;
	width?: number;
	height?: number;
}

export default class Modal extends Component<ModalProps> {

	render () {
		const { children, isOpen, onClose, width, height } = this.props;

		return createPortal((
			<React.Fragment>
				<Transition
					appear
					in={isOpen}
					timeout={200}
					mountOnEnter
					unmountOnExit
				>
					{(state) => <Overlay onClick={onClose} animationState={state} />}
				</Transition>
				<Transition
					appear
					in={isOpen}
					timeout={200}
					mountOnEnter
					unmountOnExit
				>
					{(state) => <Wrapper width={width} height={height} animationState={state}>{children}</Wrapper>}
				</Transition>
			</React.Fragment>
		), document.body);
	}
}
