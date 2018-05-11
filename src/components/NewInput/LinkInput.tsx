import { lighten } from 'polished';
import React, { HTMLProps, SFC } from 'react';
import styled from '../../util/styled-components';

const UnstyledLinkInput: SFC<HTMLProps<HTMLInputElement>> = ({ children, className, ...props }) => <label className={className}>{children}<input type="file" {...props} /></label>;

const LinkInput = styled(UnstyledLinkInput)`
	color: ${({ theme }) => theme.text.link};
	cursor: pointer;
	display: inline;

	:hover {
		color: ${({ theme }) => lighten(0.10, theme.text.link)};
		text-decoration: underline;
	}

	input {
		display: none;
	}
`;

export { LinkInput };
export default LinkInput;
