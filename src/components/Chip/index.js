import { h } from 'preact';
import styled from 'styled-components';

const Wrapper = styled.div`
	color: rgba(0, 0, 0, 0.87);
    border: none;
	height: 32px;
	margin: 4px;
    cursor: default;
    padding: 0;
    display: inline-flex;
    outline: none;
    font-size: 13px;
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    align-items: center;
    white-space: nowrap;
    border-radius: 16px;
    justify-content: center;
	background-color: rgb(220, 220, 220);
	
	:focus {
		background-color: rgb(202, 202, 202);
	}
`;

const Label = styled.span`
	cursor: inherit;
    display: flex;
    align-items: center;
    user-select: none;
    white-space: nowrap;
    padding-left: 12px;
    padding-right: 12px;
`;

const DeleteButton = styled((props) => (
	<svg focusable="false" viewBox="0 0 24 24" {...props}>
		<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
	</svg>
))`
	fill: currentColor;
    width: 24px;
    height: 24px;
    display: inline-block;
    transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    user-select: none;
	flex-shrink: 0;
	color: rgba(0, 0, 0, 0.26);
    cursor: pointer;
    height: auto;
    margin: 0 4px 0 -8px;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	
	:hover {
		color: rgba(0, 0, 0, 0.4);
	}
`;

const Chip = ({ label, onRequestDelete, ...props }) => (
	<Wrapper>
		<Label>{ label }</Label>
		{ onRequestDelete && <DeleteButton onClick={onRequestDelete} /> }
	</Wrapper>
);

export default Chip;