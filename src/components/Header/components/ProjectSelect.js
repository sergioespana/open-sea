import { h } from 'preact';
import styled from 'styled-components';
import { toJS } from 'mobx';
import map from 'lodash/map';
import Avatar from '../../Avatar';
import Menu, { MenuItem } from '../../Menu';

const ProjectSelect = ({ history, match: { params: { id } }, ...rest }, { mobxStores: { AppStore, OrgStore, DialogStore } }) => {
	if (AppStore.isLoading) return null;

	let organisations = toJS(OrgStore.organisations),
		organisation = toJS(OrgStore.organisations.get(id));

	return (
		<button {...rest} onClick={() => DialogStore.show('Select', (
			<Menu inline style={{ minWidth: 300 }}>
				{ map(organisations, (org, key) => (
					<MenuItem
						to={`/organisation/${key}`}
						onClick={DialogStore.hide}
						primary={org.name}
						secondary={key}
						icon={<Avatar src={org.logo} style={{ marginRight: 20 }}>{ org.name }</Avatar>}
					/>
				)) }
			</Menu>
		), null, true)}
		>
			<span>{ organisation.name }</span>
			<svg fill="#ffffff" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
				<path d="M7 10l5 5 5-5z" />
				<path d="M0 0h24v24H0z" fill="none" />
			</svg>
		</button>
	);
};

export default styled(ProjectSelect)`
	border: none;
	padding: 0 0 0 6px;
	margin-left: 10px;
	background-color: transparent;
	font-family: inherit;
	font-size: 13px;
	color: inherit;
	border-radius: 2px;
	height: 36px;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;

	:hover {
		cursor: pointer;
		background-color: rgba(255, 255, 255, 0.3);
	}
`;