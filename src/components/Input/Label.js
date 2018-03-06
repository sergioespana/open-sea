import styled from 'styled-components';

const Label = styled.label`
	font-size: 0.857rem;
	color: ${({ theme }) => theme.text.secondary};
	font-weight: 500;
	margin: 0 auto 0 0;
	padding-bottom: 3px;
	position: relative;

	&[required]:after {
		content: '*';
		position: absolute;
		top: 0;
		margin-left: 2px;
		color: red;
	}
`;

export default Label;