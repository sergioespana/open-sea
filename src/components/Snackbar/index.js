import { h } from 'preact';
import { observer } from 'mobx-react';
import Portal from 'preact-portal';

import Wrapper from './components/Wrapper';
import Content from './components/Content';
import Action from './components/Action';

const Snackbar = (props, { mobxStores: { SnackStore } }) => {
	let isOpen = SnackStore.isOpen,
		snackbar = SnackStore.snackbar,
		doClose = snackbar.get('doClose'),
		message = snackbar.get('message'),
		action = snackbar.get('action'),
		actionMessage = snackbar.get('actionMessage');

	return (
		<Portal into="body">
			{ isOpen ? (
				<Wrapper doClose={doClose} onClick={SnackStore.hide}>
					{ message && <Content>{ message }</Content> }
					{ action && actionMessage && <Action action={action}>{ actionMessage }</Action> }
				</Wrapper>
			) : null }
		</Portal>
	);
};

export {
	Content as SnackbarContent,
	Action as SnackbarAction
};
export default observer(Snackbar);