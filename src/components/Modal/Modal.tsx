import React, { Component, SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';
import Overlay from './Overlay';
import Wrapper from './Wrapper';

interface ModalProps {
	isOpen?: boolean;
	onClose?: (event: SyntheticEvent<any>) => void;
}

export default class Modal extends Component<ModalProps> {

	render () {
		const { children, isOpen, onClose } = this.props;

		return isOpen && createPortal((
			<React.Fragment>
				<Overlay onClick={onClose} />
				<Wrapper>{children}</Wrapper>
			</React.Fragment>
		), document.body);
	}
}
