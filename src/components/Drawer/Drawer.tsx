import React, { Component, SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';
import { MdArrowBack } from 'react-icons/md';
import Transition from 'react-transition-group/Transition';
import Overlay from '../FullscreenOverlay';
import Button from './Button';
import { DrawerContentHeader, DrawerContentSection, DrawerMainSection, DrawerSection } from './Section';
import Wrapper from './Wrapper';

interface DrawerProps {
	closeIconPosition: 'top' | 'bottom';
	isOpen?: boolean;
	mainIcon: React.ReactNode;
	onClose?: (event: SyntheticEvent<any>) => void;
	width?: number;
}

export default class Drawer extends Component<DrawerProps> {

	render () {
		const {
			children,
			closeIconPosition,
			isOpen,
			mainIcon,
			onClose,
			width
		} = this.props;

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
					{(state) => (
						<Wrapper width={width} animationState={state}>
							<DrawerMainSection>
								<DrawerContentHeader style={{ alignItems: 'center' }}><Button disabled round>{mainIcon}</Button></DrawerContentHeader>
								<DrawerContentSection>
									<Button disabled={closeIconPosition !== 'top'} round onClick={onClose}>{closeIconPosition === 'top' && <MdArrowBack />}</Button>
									<Button disabled={closeIconPosition !== 'bottom'} round onClick={onClose}>{closeIconPosition === 'bottom' && <MdArrowBack />}</Button>
								</DrawerContentSection>
							</DrawerMainSection>
							<DrawerSection>
								<DrawerContentHeader />
								<DrawerContentSection onClick={onClose}>
									{closeIconPosition === 'bottom' && <Button disabled />}
									{children}
								</DrawerContentSection>
							</DrawerSection>
						</Wrapper>
					)}
				</Transition>
			</React.Fragment>
		), document.body);
	}
}
