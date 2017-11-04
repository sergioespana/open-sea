import { h } from 'preact';
import { observer } from 'mobx-react';
import Portal from 'preact-portal';

import Wrapper from './components/Wrapper';
import Content from './components/Content';
import Action from './components/Action';

const Snackbar = (props, { mobxStores: { SnackStore } }) => (
	<Portal into="body">
		{ SnackStore.isOpen ? (
			<Wrapper doClose={SnackStore.snackbar.get('doClose')} onClick={SnackStore.hide}>
				{ SnackStore.snackbar.get('message') && <Content>{ SnackStore.snackbar.get('message') }</Content> }
				{ SnackStore.snackbar.get('action') && SnackStore.snackbar.get('actionMessage') && <Action action={SnackStore.snackbar.get('action')}>{ SnackStore.snackbar.get('actionMessage') }</Action> }
			</Wrapper>
		) : null }
	</Portal>
);

export {
	Content as SnackbarContent,
	Action as SnackbarAction
};
export default observer(Snackbar);