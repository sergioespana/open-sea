import React from 'react';
import styled from 'styled-components';

const Title = styled((props) => <h1 {...props} />)`
	margin: 0;
	font-weight: 500;
	font-size: 1.5rem;
`;

const Breadcrumbs = styled.ol`
	margin: 0 0 10px 0;
	padding: 0;
	list-style: none;

	li {
		padding: 0 10px 0 0;
		display: inline;
		color: #5E6C84;
		font-size: 0.875rem;

		a:not(:hover) {
			color: inherit;
		}

		+ li:before {
			content: "/";
			padding-right: 10px;
		}
	}
`;

const Wrapper = styled.div`
	padding-bottom: 5px;
	margin: 20px 20px 0 20px;
	display: flex;
`;

const PrimaryContainer = styled.div`
	flex: auto;
`;

const SecondaryContainer = styled.div``;

const Header = styled(({ breadcrumbs, secondary, title, ...props }) => (
	<header {...props}>
		<Wrapper>
			<PrimaryContainer>
				{ breadcrumbs && (
					<Breadcrumbs>
						{ breadcrumbs.map((breadcrumb) => <li>{ breadcrumb }</li>) }
					</Breadcrumbs>
				) }
				{ title && <Title>{ title }</Title> }
			</PrimaryContainer>
			{ secondary && <SecondaryContainer>{ secondary }</SecondaryContainer> }
		</Wrapper>
	</header>
))``;

export default Header;