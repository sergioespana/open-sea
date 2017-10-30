import { h } from 'preact';
import { Link } from 'react-router-dom';
import { map } from 'lodash';

import Wrapper from './components/Wrapper';
import MenuButton from './components/MenuButton';
import Title from './components/Title';
import ProjectSelect from './components/ProjectSelect';

import { Option } from '../Select';

const Header = ({ match: { params: { org } } }, { router: { history: { push } }, mobxStores: { store } }) => (
	<Wrapper>
		<MenuButton onClick={store.toggleDrawer} />
		<Title><Link to="/"><strong>SEA</strong> Manager</Link></Title>
		{ org && (
			<ProjectSelect value={org} onChange={(value) => push(`/${value}`)}>
				<Option value="" text="See all" />
				{ map(store.organisations, (org, id) => (
					<Option value={id} text={ org.name } />
				)) }
			</ProjectSelect>
		) }
	</Wrapper>
);

export default Header;