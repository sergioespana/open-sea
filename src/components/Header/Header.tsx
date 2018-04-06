import { map } from 'lodash';
import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';

const StyledHeader = styled.header`
	display: flex;
	margin: 20px 20px 0;
	padding: 0 0 5px 0;
`;

const BreadcrumbContainer = styled.ol`
	color: ${({ theme }) => theme.text.secondary};
	display: flex;
	flex-wrap: nowrap;
	list-style: none;
	margin: 0 0 10px 0;
	padding: 0;

	*,
	*:hover {
		color: inherit;
	}

	li {
		padding-right: 10px;

		& + li:before {
			content: "/";
   			padding-right: 10px;
		}
	}
`;

const PrimaryContainer = styled.section`
	flex: auto;
`;

const SecondaryContainer = styled.section`
	align-items: flex-end;
	display: flex;

	& > * {
		margin-left: 10px;
	}
`;

interface HeaderProps {
	breadcrumbs?: React.ReactElement<any>[];
	title: string;
	headTitle?: string;
}

export default class Header extends Component<HeaderProps> {

	render () {
		const { breadcrumbs, children, title, headTitle } = this.props;

		return (
			<Fragment>
				<Helmet title={headTitle || title} />
				<StyledHeader>
					<PrimaryContainer>
						{breadcrumbs && (
							<BreadcrumbContainer>
								{map(breadcrumbs, (crumb) => <li>{crumb}</li>)}
							</BreadcrumbContainer>
						)}
						<h1>{title}</h1>
					</PrimaryContainer>
					{children && <SecondaryContainer>{children}</SecondaryContainer>}
				</StyledHeader>
			</Fragment>
		);
	}
}
