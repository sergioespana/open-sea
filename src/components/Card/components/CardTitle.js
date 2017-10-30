import { h } from 'preact';
import styled from 'styled-components';

const CardTitle = ({ primary, secondary, ...props }) => (
	<div {...props}>
		{ primary && <h1>{ primary }</h1> }
		{ secondary && <h2>{ secondary }</h2> }
	</div>
);

export default styled(CardTitle)`
	padding: 24px 16px 0px 16px;

	:last-child {
		padding: 24px 16px 16px;
	}

	h1, h2 {
		margin: 0;
		color: inherit;
		font-weight: 300;
	}

	h1 {
		font-size: 24px;
	}

	h2 {
		font-size: 14px;
	}
`;