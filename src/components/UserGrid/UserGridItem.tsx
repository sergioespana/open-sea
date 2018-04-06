import styled from 'styled-components';
import { Button } from '../Button';

export default styled(Button)`
	display: flex;
	flex-direction: column;
	height: 160px;

	& > img {
		border-color: #ffffff;
		border-radius: 50%;
		border-style: solid;
		border-width: 2px;
		display: block;
		height: 85px;
		margin: 0 auto;
		width: 85px;
	}

	& > span {
		margin: 12px 0 0;
	}
`;
