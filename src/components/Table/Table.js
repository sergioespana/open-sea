import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import React from 'react';
import Select from 'components/Input/Select';
import styled from 'styled-components';
import uniq from 'lodash/uniq';

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

// TODO: Allow sorting of columns that have sortable data, autodetect.
// TODO: Allow filtering through specified filters.
// TODO: Create FilterSelect (or add prop isFilter to a new Select compontent).
// TODO: Create toggleable button for boolean values.

const Table = styled(({ columns = [], data = [], filters = [], ...props }) => (
	<React.Fragment>
		{ filters && (
			<FilterContainer>
				<span>Filter by:</span>
				{ map(filters, (filter, key) => {
					const index = indexOf(columns, filter);
					const options = map(uniq(map(data, (row) => get(row[index], 'props.children') || 'None')), (option) => ({ value: option, text: option }));
					return (
						<Select
							key={key}
							options={options}
						/>
					);
				}) }
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