import { dropRight, filter, find, map, reject } from 'lodash';
import React, { Component, HTMLProps } from 'react';
import { findDOMNode } from 'react-dom';
import { LinkProps, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { BackButton, Button } from './Button';
import { Expander, ExpanderButton } from './Expander';
import {
	NavigationContentFooter as ContentFooter,
	NavigationContentHeader as ContentHeader,
	NavigationContentSection as ContentSection,
	NavigationMainSection as Main,
	NavigationSection as Section
} from './Section';

const Aside = styled.aside`
	bottom: 0;
	display: flex;
	flex-wrap: nowrap;
	left: 0;
	position: fixed;
	top: 0;
	width: auto;
	z-index: 5;
`;

const Placeholder = styled.div`
	flex-grow: 0;
	flex-shrink: 0;
`;

export interface NavigationItem extends HTMLProps<HTMLButtonElement> {
	element?: React.ReactNode;
	icon?: React.ReactNode;
	isHeader?: boolean;
	label?: string;
	navigationItems?: NavigationItem[];
	to?: LinkProps['to'];
}
interface Props {
	appearance: 'default' | 'light';
	createIcon?: React.ReactNode;
	createIconAction?: Function;
	createIconHref?: LinkProps['to'];
	expandable?: boolean;
	expanded?: boolean;
	expandedAppearance?: Props['appearance'];
	footerItems?: NavigationItem[];
	helpIcon?: React.ReactNode;
	helpIconAction?: Function;
	helpIconHref?: LinkProps['to'];
	loading?: boolean;
	mainIcon: React.ReactNode;
	mainIconHref: LinkProps['to'];
	navigationItems?: NavigationItem[];
	profileIcon?: React.ReactNode;
	profileIconAction?: Function;
	profileIconHref?: LinkProps['to'];
	searchIcon?: React.ReactNode;
	searchIconAction?: Function;
	searchIconHref?: LinkProps['to'];
	toggleExpanded?: Function;
}
export default class Navigation extends Component<Props> {
	state = {
		width: 0
	};

	componentDidMount () { return this.setState({ width: findDOMNode(this).getBoundingClientRect().width }); }

	componentDidUpdate () {
		const width = findDOMNode(this).getBoundingClientRect().width;
		if (width !== this.state.width) return this.setState({ width });
	}

	render () {
		const {
			appearance,
			createIcon,
			createIconAction,
			createIconHref,
			expandable,
			expanded,
			expandedAppearance,
			footerItems,
			loading,
			mainIcon,
			mainIconHref,
			navigationItems,
			searchIcon,
			searchIconAction,
			searchIconHref,
			toggleExpanded
		} = this.props;
		const { width } = this.state;
		const mainSectionProps = { appearance: expandable && !expanded ? expandedAppearance : appearance };
		const mainSectionButtonProps = { appearance: expandable && !expanded ? expandedAppearance : appearance };
		const expandedSectionProps = { appearance: expandedAppearance || appearance };
		const expandedSectionButtonProps = { appearance: expandedAppearance || appearance };
		const expanderButtonProps = { expanded, onClick: toggleExpanded };
		const contentProps = { loading };

		return (
			<React.Fragment>
				<Aside>
					<Main {...mainSectionProps}>
						<ContentHeader style={{ alignItems: 'center' }} {...contentProps}><Button round to={mainIconHref} {...mainSectionButtonProps}>{mainIcon}</Button></ContentHeader>
						<ContentSection {...contentProps}>
							{searchIcon && <Button round to={searchIconHref} onClick={searchIconAction} {...mainSectionButtonProps}>{searchIcon}</Button>}
							{createIcon && <Button round to={createIconHref} onClick={createIconAction} {...mainSectionButtonProps}>{createIcon}</Button>}
						</ContentSection>
						<ContentSection {...contentProps}>
							{(!expandable || (expandable && !expanded)) && renderItems(filter(navigationItems, 'icon'), mainSectionButtonProps)}
						</ContentSection>
						<ContentFooter {...contentProps}>
							{renderItems(footerItems, { round: true, ...mainSectionButtonProps })}
						</ContentFooter>
					</Main>
					{expandable && expanded && (
						<Section {...expandedSectionProps}>
							<ContentHeader {...contentProps}>
								{renderItems(filter(navigationItems, { isHeader: true }), { large: true, ...expandedSectionButtonProps })}
							</ContentHeader>
							<ContentSection {...contentProps}>
								{find(navigationItems, 'navigationItems')
									? rederItemsWithNested(navigationItems, expandedSectionButtonProps)
									: renderItems(reject(navigationItems, { isHeader: true }), expandedSectionButtonProps)
								}
							</ContentSection>
						</Section>
					)}
					{expandable && <Expander><ExpanderButton {...expanderButtonProps} /></Expander>}
				</Aside>
				<Placeholder style={{ width }} />
			</React.Fragment>
		);
	}
}

const renderItems = (items: NavigationItem[], initialProps: object) => map(items, ({ element, hidden, icon, isHeader: large, label, to }) => {
	// If item is hidden (for example when the current user does not have access),
	// render nothing.
	if (hidden) return null;
	// If an element is passed, render that immediately.
	if (element) return element;
	// If no icon, assume it's a text-only item and render a heading.
	if (!icon && large) return <h1>{label}</h1>;
	// Otherwise, render a button.
	const props = { ...initialProps, exact: true, large, to };
	return <Button {...props}>{icon}{label}</Button>;
});

const renderNestedItems = (items: NavigationItem[], initialProps: object) => map(items, ({ label, navigationItems, to }) => {
	const NestedButtons = () => (
		<React.Fragment>
			<BackButton to={dropRight(to.toString().split('/')).join('/')} {...initialProps}>{label}</BackButton>
			{renderItems(navigationItems, initialProps)}
		</React.Fragment>
	);

	return <Route path={to.toString()} component={NestedButtons} />;
});

const rederItemsWithNested = (items: NavigationItem[], initialProps: object) => {

	const RootComponent = () => (
		<React.Fragment>
			{renderItems(reject(items, { isHeader: true }), initialProps)}
		</React.Fragment>
	);

	return (
		<Switch>
			{renderNestedItems(filter(items, 'navigationItems'), initialProps)}
			<Route path="*" component={RootComponent} />
		</Switch>
	);
};
