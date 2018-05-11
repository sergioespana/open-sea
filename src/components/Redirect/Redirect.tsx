import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { SFC } from 'react';
import { Redirect as ReactRedirect, RedirectProps as ReactRedirectProps } from 'react-router-dom';

interface RedirectProps extends ReactRedirectProps {
	authedOnly?: boolean;
	unauthedOnly?: boolean;
}

export const Redirect: SFC<RedirectProps> = inject(app('state'))(observer((props) => {
	const { authedOnly, state, unauthedOnly } = props;
	const { isAuthed } = state;

	if (
		(authedOnly && !isAuthed) ||
		(unauthedOnly && isAuthed)
	) return null;

	return <ReactRedirect {...props} />;
}));
