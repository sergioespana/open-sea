import FieldContainer from '../NewInput/FieldContainer';

export default FieldContainer.extend`
	:hover {
		cursor: ${({ isSearchable }: any) => isSearchable ? 'text' : 'pointer'};
	}
`;
