import React, { Component, SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';
import Overlay from '../FullscreenOverlay';
import Wrapper from './Wrapper';

interface ModalProps {
	isOpen?: boolean;
	onClose?: (event: SyntheticEvent<any>) => void;
	width?: number;
}

export default class Modal extends Component<ModalProps> {

	render () {
		const { children, isOpen, onClose, width } = this.props;

		return isOpen && createPortal((
			<React.Fragment>
				<Overlay onClick={onClose} />
				<Wrapper width={width}>{children}</Wrapper>
			</React.Fragment>
		), document.body);
	}
}
