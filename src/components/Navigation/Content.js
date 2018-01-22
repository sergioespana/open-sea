import React from 'react';
import styled from 'styled-components';

const Content = styled(({ fill, fullWidth, ...props }) => <div {...props} />)`
	display: flex;
	flex-direction: column;
	align-items: ${({ fullWidth }) => fullWidth ? 'flex-start' : 'center'};
	padding: ${({ fullWidth }) => fullWidth ? '0 16' : '0 8'}px;
	width: 100%;
	
	${({ fill }) => fill && `flex: auto;`}
`;

export default Content;