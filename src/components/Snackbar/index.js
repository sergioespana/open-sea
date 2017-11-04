import { h } from 'preact';
import { observer } from 'mobx-react';
import Portal from 'preact-portal';

import Wrapper from './components/Wrapper';
import Content from './components/Content';
import Action from './components/Action';

const Snackbar = (props, { mobxStores: { store } }) => (
	<Portal into="body">
		{ store.snackbar.open ? (
			<Wrapper doClose={store.snackbar.doClose} onClick={store.hideSnackbar}>
				{ store.snackbar.message && <Content>{ store.snackbar.message }</Content> }
				{ store.snackbar.action && store.snackbar.actionMessage && <Action action={store.snackbar.action}>{ store.snackbar.actionMessage }</Action> }
			</Wrapper>
		) : null }
	</Portal>
);

export {
	Content as SnackbarContent,
	Action as SnackbarAction
};
export default observer(Snackbar);