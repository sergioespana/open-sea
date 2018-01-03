import React from 'react';
import styled from 'styled-components';

const File = styled(({ children, className, label, src, ...props }) => (
	<label className={ className }>
		<img src={ src } />
		<div>Choose { label.toLowerCase() }</div>
		<input type="file" {...props} />
	</label>
)) `
	width: 96px;
	height: 96px;
	display: flex;
	position: relative;

	img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	div {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 5px;
		padding: 12px;
		text-align: center;
		display: none;
	}

	input {
		display: none;
	}

	:hover div {
		cursor: pointer;
		display: flex;
	}

	${({ disabled }) => disabled && `
		pointer-events: none;
	`}
`;

export default File;