import { font } from 'material-styled-components/mixins/typography';
import React from 'react';
import styled from 'styled-components';

const Placeholder = styled(({ ...props }) => <div {...props} />)`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate3d(-50%, -50%, 0);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: ${props => props.theme.textColors.primary};
	
	h1 {
		${ font(400, 24, 20) }
		margin: 0;
	}
`;

export default Placeholder;