import Container from '../NewInput/Container';

export default Container.extend`
	:hover {
		cursor: ${({ isSearchable }: any) => isSearchable ? 'text' : 'pointer'};
	}
`;
