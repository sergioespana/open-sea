import { h } from 'preact';
import Switch from '../../components/Switch';

import GroupWrapper from './components/GroupWrapper';
import GroupTitle from './components/GroupTitle';
import InnerGroupWrapper from './components/InnerGroupWrapper';

import ItemWrapper from './components/ItemWrapper';
import ItemTitleWrapper from './components/ItemTitleWrapper';
import ItemPrimary from './components/ItemPrimary';
import ItemSecondary from './components/ItemSecondary';
import ItemSeparator from './components/ItemSeparator';
import ItemIcon from './components/ItemIcon';

const SettingsGroup = ({ title, hide, children }) => !hide ? (
	<GroupWrapper>
		<GroupTitle>{ title }</GroupTitle>
		<InnerGroupWrapper>{ children }</InnerGroupWrapper>
	</GroupWrapper>
) : null;

const SettingsItem = (props) => !props.hide ? (
	<ItemWrapper {...props}>
		{ props.secondary && props.prefix ? props.prefix  : null }
		<ItemTitleWrapper>
			{ props.primary && <ItemPrimary>{ props.primary }</ItemPrimary> }
			{ props.secondary && <ItemSecondary>{ props.secondary }</ItemSecondary> }
		</ItemTitleWrapper>
		{ (props.to || props.onClick) && props.enabled === undefined && <ItemIcon /> }
		{ typeof props.enabled === 'boolean' && <Switch checked={props.enabled} onClick={(event) => event.preventDefault()} /> }
		{ props.secondary && props.suffix && <ItemSeparator /> }
		{ props.secondary && props.suffix }
	</ItemWrapper>
) : null;

export {
	SettingsGroup,
	SettingsItem
};