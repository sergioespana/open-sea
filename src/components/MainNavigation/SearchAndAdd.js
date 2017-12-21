import { inject } from 'mobx-react';
import MdAdd from 'react-icons/lib/md/add';
import MdSearch from 'react-icons/lib/md/search';
import { NavigationButton } from 'components/Navigation';
import React from 'react';

const SearchAndAdd = inject('MVCStore')(({ loading, MVCStore }) => (
	<React.Fragment>
		<NavigationButton round onClick={MVCStore.toggleSearchDrawer} loading={loading}><MdSearch width={24} height={24} /></NavigationButton>
		<NavigationButton round onClick={MVCStore.toggleCreateDrawer} style={{ marginBottom: 16 }} loading={loading}><MdAdd width={24} height={24} /></NavigationButton>
	</React.Fragment>
));

export default SearchAndAdd;