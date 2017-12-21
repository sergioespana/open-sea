import map from 'lodash/map';
import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
	min-width: 570px;
	position: relative;
	margin-top: 20px;
    margin-bottom: 10px;
    height: 30px;
	display: flex;
	align-items: center;

	span {
		color: #999;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
	}
`;

const Table = styled(({ columns = [], data = [], filters = [], ...props }) => (
	<React.Fragment>
		{ filters.length > 0 && (
			<FilterContainer>
				<span>Filter by:</span>
			</FilterContainer>
		) }
		<table {...props}>
			<thead>
				<tr>
					{ map(columns, (col, i) => (
						<th key={i}>{ col }</th>
					)) }
				</tr>
			</thead>
			<tbody>
				{ map(data, (item, i) => (
					<tr key={i}>
						{ map(item, (entry, i) => <td key={i}>{ entry }</td>) }
					</tr>
				)) }
			</tbody>
		</table>
	</React.Fragment>
))`
	border-collapse: collapse;
	width: 100%;
	font-size: 0.875rem;

	thead,
	tbody {
		border-bottom: 2px solid #ccc;
	}

	thead th,
	tbody tr td {
		padding: 7px 10px;
		text-align: left;
	}

	th {

		:hover {
			background: #f5f5f5;
			cursor: pointer;
		}
	}

	td {
		color: #999;
	}

	span {
		display: flex;
		align-items: center;

		img {
			width: 24px;
			height: 24px;
			border-radius: 50%;
			margin-right: 10px;
		}
	}
`;

export default Table;