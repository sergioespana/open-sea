import { h } from 'preact';
import { find } from 'lodash';

import Grid from '../../components/Grid';
import Card, { CardTitle, CardContent } from '../../components/Card';

const Assistant  = ({ match: { params: { org } } }, { mobxStores: { store } }) => (
	<Grid cols={3}>
		
	</Grid>
);

export default Assistant;