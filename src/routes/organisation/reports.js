import { inject, observer } from 'mobx-react';
import Avatar from 'material-styled-components/Avatar';
import CenterProgress from 'components/CenterProgress';
import Grid from 'components/Grid';
import ImageCard from 'components/ImageCard';
import Main from 'components/Main';
import MdAdd from 'react-icons/lib/md/add';
import moment from 'moment';
import React from 'react';

const Overview = inject('ReportsStore')(observer(({ ReportsStore, match: { params: { id } } }) => ReportsStore.loading ? (
	<CenterProgress />
) : (
	<Main container>
		<Grid childMinWidth={200}>
			<ImageCard
				to={`/${id}/new`}
				primary="Create new"
				icon={<MdAdd />}
			/>
			{ Object.keys(ReportsStore.findById(id, null, true)).reverse().map((key) => {
				let report = ReportsStore.findById(id, key, true),
					name = report.name,
					created = moment(report.created).fromNow();
				return (
					<ImageCard
						key={key}
						to={`/${id}/${key}`}
						primary={name}
						secondary={`Created ${created}`}
						icon={<Avatar>{ name }</Avatar>}
					/>
				);
			}) }
		</Grid>
	</Main>
)));

export default Overview;