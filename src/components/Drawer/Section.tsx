import {
	NavigationContentFooter,
	NavigationContentHeader,
	NavigationContentSection,
	NavigationMainSection,
	NavigationSection
} from '../Navigation/Section';

export const DrawerMainSection = NavigationMainSection.extend`
	background-color: #ffffff;
`;

export const DrawerSection = NavigationSection.extend`
	background-color: #ffffff;
	flex: auto;
`;

export const DrawerContentHeader = NavigationContentHeader.extend``;

export const DrawerContentFooter = NavigationContentFooter.extend``;

export const DrawerContentSection = NavigationContentSection.extend`
	& > h3 {
		width: 100%;
		margin: 0 0 6px 0;
	}
`;
