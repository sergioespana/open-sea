import { h } from 'preact';
import styled from 'styled-components';

import Select from '../../Select';

const ProjectSelect = ({ children, ...props }) => (
	<Select {...props}>{ children }</Select>
);

export default styled(ProjectSelect)`
	margin-left: 14px;
	display: none;

	@media (min-width: 601px) {
		display: flex;
	}
`;