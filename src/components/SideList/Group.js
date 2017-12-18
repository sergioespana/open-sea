import React from 'react';
import styled from 'styled-components';

const Group = styled(({ ...props }) => <ul {...props} />) `
	list-style: none;
	margin: 0;
	padding: 0;
`;

export default Group;