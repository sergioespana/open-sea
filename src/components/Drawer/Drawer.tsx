import React, { Component, SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
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

		return isOpen && createPortal((
			<React.Fragment>
				<Overlay onClick={onClose} />
				<Wrapper width={width}>
					<DrawerMainSection>
						<DrawerContentHeader style={{ alignItems: 'center' }}><Button disabled round>{mainIcon}</Button></DrawerContentHeader>
						<DrawerContentSection>
							<Button disabled={closeIconPosition !== 'top'} round onClick={onClose}>{closeIconPosition === 'top' && <MdArrowBack />}</Button>
							<Button disabled={closeIconPosition !== 'bottom'} round onClick={onClose}>{closeIconPosition === 'bottom' && <MdArrowBack />}</Button>
						</DrawerContentSection>
					</DrawerMainSection>
					<DrawerSection>
						<DrawerContentHeader />
						<DrawerContentSection>
							{closeIconPosition === 'bottom' && <Button disabled />}
							{children}
						</DrawerContentSection>
					</DrawerSection>
				</Wrapper>
			</React.Fragment>
		), document.body);
	}
}
