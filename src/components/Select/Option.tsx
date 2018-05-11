import { transparentize } from 'polished';
import React from 'react';
import styled from '../../util/styled-components';

const MainContent = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const MainLabel = styled.span`
	color: inherit;
	display: block;
`;

const SubLabel = styled.span`
	color: ${({ theme }) => theme.text.secondary};
	display: block;
	font-size: 0.875rem;
	margin: 3px 0 0 0;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	word-break: break-all;
`;

// TODO: Add typing.
const UnstyledOption = ({ className, data, innerProps, isDisabled, isFocused }) => (
	<div {...{ className, ...innerProps }} data-hasFocus={isFocused} disabled={isDisabled}>
		{data.icon}
		<MainContent>
			<MainLabel>{data.label}</MainLabel>
			<SubLabel>{data.subLabel}</SubLabel>
		</MainContent>
	</div>
);

export const Option = styled(UnstyledOption)`
	align-items: center;
	color: ${({ theme }) => theme.text.primary};
	display: flex;
	flex-wrap: nowrap;
	padding: 8px 12px;

	:hover,
	&[data-hasFocus]:not([data-hasFocus="false"]) {
		background-color: ${({ theme }) => theme.light};
		cursor: pointer;
	}

	:active {
		background-color: ${({ theme }) => transparentize(0.7, theme.primary)};
		color: ${({ theme }) => theme.primary};
	}

	&[aria-selected]:not([aria-selected="false"]) {}

	&[disabled]:not([disabled="false"]) {
		color: ${({ theme }) => theme.text.secondary};
		pointer-events: none;
	}

	& > img {
		border-radius: 50%;
		height: 24px;
		margin: 0 10px 0 0;
		width: 24px;
	}
`;

export default Option;
