import { inject, observer } from 'mobx-react';
import React from 'react';
import Snack from 'material-styled-components/Snackbar';
import { toJS } from 'mobx';

const Snackbar = inject('SnackbarStore')(observer(({ SnackbarStore }) => {
	const snackbar = toJS(SnackbarStore.snackbar);
	return (
		<Snack {...snackbar} />
	);
}));

export default Snackbar;