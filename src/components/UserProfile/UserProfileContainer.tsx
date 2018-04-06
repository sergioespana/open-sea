import styled from 'styled-components';

interface Props {
	flexRight?: boolean;
}

export default styled<Props, 'section'>('section')`
	margin: 0 auto;
	max-width: 800px;
	padding: 20px 20px 0 20px;

	${({ flexRight }) => flexRight && `
		align-items: center;
		display: flex;
		justify-content: flex-end;

		& > * {
			margin-left: 8px;
		}
	`}
`;
