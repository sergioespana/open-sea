import styled, { css } from '../../util/styled-components';

const loading = (opacity = 0.3) => css`
	pointer-events: none;
	opacity: ${opacity};

	a,
	button {
		background-color: transparent !important;
	}

	a > *,
	button > *,
	h1 {
		background-color: currentColor;
	}

	a > span,
	button > span,
	h1 {
		border-radius: 3px;
		width: 100%;
	}

	a > span,
	button > span {
		margin-right: 8px;
	}

	h1 {
		max-height: 19px;
		text-indent: 100%;
		overflow: hidden;
	}

	svg {
		border-radius: 50%;
	}
`;

interface SectionProps {
	appearance?: 'default' | 'light';
	loading?: boolean;
}
export const NavigationMainSection = styled<SectionProps, 'section'>('section') `
	background-color: ${({ appearance, theme }) => appearance === 'light' ? theme.light : theme.primary};
	color: ${({ appearance, theme }) => appearance === 'light' ? theme.text.primary : '#ffffff'};
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 16px 8px;
	width: 64px;
`;

export const NavigationSection = styled<SectionProps, 'section'>('section') `
	background-color: ${({ appearance, theme }) => appearance === 'light' ? theme.light : theme.primary};
	color: ${({ appearance, theme }) => appearance === 'light' ? theme.text.primary : '#ffffff'};
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 16px 12px;
	width: 240px;

	h1 {
		font-weight: 400;
	}
`;

export const NavigationContentHeader = styled.header`
	display: flex;
	flex-direction: column;
	height: 64px;
	justify-content: center;

	${(props) => props.loading && loading(0.5)}
`;

export const NavigationContentSection = styled.section`
	align-items: center;
	display: flex;
	flex-direction: column;
	padding: 8px 0;

	${(props) => props.loading && loading()}
`;

export const NavigationContentFooter = styled.footer`
	align-items: center;
	display: flex;
	flex: auto;
	flex-direction: column;
	justify-content: flex-end;

	${(props) => props.loading && loading()}
`;
