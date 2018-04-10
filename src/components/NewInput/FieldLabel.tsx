import React, { HTMLProps, SFC } from 'react';
import styled, { css } from '../../util/styled-components';

const styles = css`
	color: ${({ theme }) => theme.text.secondary};
	font-size: 0.857rem;
	font-weight: 500;
	margin: 0px auto 0px 0px;
	padding: 0 0 3px 0;
	position: relative;

	&[required]:not([required="false"]) {
		:after {
			color: ${({ theme }) => theme.red};
			content: '*';
			margin-left: 2px;
			position: absolute;
		}
	}
`;

const UnstyledFieldLabel: SFC<HTMLProps<HTMLLabelElement>> = (props) => <label {...props} />;
const FieldLabel = styled(UnstyledFieldLabel)`${styles}`;

const UnstyledFieldLegend: SFC<HTMLProps<HTMLLegendElement>> = (props) => <legend {...props} />;
const FieldLegend = styled(UnstyledFieldLegend)`${styles}`;

export { FieldLabel, FieldLegend };
export default FieldLabel;
