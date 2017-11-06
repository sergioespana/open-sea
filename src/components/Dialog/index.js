import { h } from 'preact';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Portal from 'preact-portal';
import map from 'lodash/map';

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 90;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
	justify-content: center;
	opacity: ${props => props.doClose ? '0' : '1' };
	animation-name: dialogAppear;
	animation-duration: 225ms;
	animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
	transition: opacity 195ms cubic-bezier(0.0, 0.0, 0.2, 1);

	@keyframes dialogAppear {
		from { opacity: 0; }
		to { opacity: 1; }
	}
`;

const Container = styled.div`
	max-width: 600px;
	flex: 0 1 auto;
    margin: 32px;
    display: flex;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
	flex-direction: column;
	box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.1);
	border-radius: 2px;
	background-color: #fff;
`;

let DialogTitle = ({ children, ...props }) => (
	<div {...props}>
		<h2>{children}</h2>
	</div>
);

DialogTitle = styled(DialogTitle)`
	padding: 24px 24px 20px 24px;

	h2 {
		margin: 0;
	}
`;

const DialogContent = styled.div`
	padding: ${props => props.simple ? '0' : '0 24px 24px 24px' };
`;

const DialogContentText = styled.p`
	color: rgba(0, 0, 0, 0.54);
    margin: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5em;
`;

const DialogActions = styled.div`
	flex: 0 0 auto;
    margin: 8px 4px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const ActionContainer = styled.div`
	margin: 0 4px;
`;

const Dialog = (props, { mobxStores: { DialogStore } }) => {
	let isOpen = DialogStore.isOpen,
		dialog = DialogStore.dialog,
		doClose = dialog.get('doClose'),
		title = dialog.get('title'),
		children = dialog.get('content'),
		actions = dialog.get('actions'),
		simple = dialog.get('simple');

	return (
		<Portal into="body">
			{ isOpen ? (
				<Overlay doClose={doClose} onClick={DialogStore.hide}>
					<Container>
						{ title && <DialogTitle>{ title }</DialogTitle> }

						{ children && <DialogContent simple={simple}>
							{ typeof children === 'string' ? (
								<DialogContentText>{ children }</DialogContentText>
							) : children }
						</DialogContent> }

						{ actions && (
							<DialogActions>
								{ map(actions, (action) => (
									<ActionContainer onClick={DialogStore.hide}>
										<button onClick={action.handler}>{ action.message }</button>
									</ActionContainer>
								)) }
							</DialogActions>
						) }
					</Container>
				</Overlay>
			) : null }
		</Portal>
	);
};

export default observer(Dialog);