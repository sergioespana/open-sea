import Button from 'components/Button';
import React from 'react';
import styled from 'styled-components';

const PeopleButton = styled(({ className, user, ...props }) => (
	<Button
		appearance="subtle"
		className={className}
		to={`/dashboard/people/${user._uid}`}
	>
		<img src={user.avatar} />
		<span>{ user.name }</span>
	</Button>
))`
	height: 160px;
	flex: 0 0 160px;
	flex-direction: column;
	justify-content: center;


	:focus {
		box-shadow: inset 0 0 0 2px ${({ theme }) => theme.accent};
	}

	img {
		display: block;
		margin: 0 auto;
		border-radius: 50%;
		width: 85px;
		height: 85px;
		border: 2px solid #ffffff;
	}

	span {
		margin-top: 12px;
	}
`;

export default PeopleButton;