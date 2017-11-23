import Card, { CardTitle, CardContent } from 'material-styled-components/Card';
import Container from 'components/Container';
import Grid from 'components/Grid';
import Main from 'components/Main';
import React from 'react';

const Assistant = () => (
	<Main bg="#eee">
		<Container medium>
			<Grid childMinWidth={400}>
				<Card>
					<CardTitle primary="Assistant card" />
					<CardContent>
						Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
					</CardContent>
				</Card>
			</Grid>
		</Container>
	</Main>
);

export default Assistant;