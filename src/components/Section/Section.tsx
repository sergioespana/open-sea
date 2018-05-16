import styled from 'styled-components';

interface SectionProps {
	maxWidth?: number;
	width?: number;
}

export default styled<SectionProps, 'section'>('section')`
	flex: ${({ width }) => width ? `0 0 ${width}px` : 'auto'};
	margin: 0 auto;
	max-width: ${({ maxWidth }) => maxWidth ? `${maxWidth}px` : 'none'};
	padding: 20px 20px 100px;

	&:first-child {
		padding-left: 0;
	}

	&:last-child {
		padding-right: 0;
	}

	& + section {
		border-left: 1px solid #e0e0e0;
	}

	& > h1 {
		font-size: 1.125rem;
	}
`;
