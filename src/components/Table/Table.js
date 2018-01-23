import { parse, stringify } from 'query-string';
import React, { Component, Fragment } from 'react';
import find from 'lodash/find';
import { Link } from 'components/Link';
import map from 'lodash/map';
import MdArrowDropDown from 'react-icons/lib/md/arrow-drop-down';
import MdArrowDropUp from 'react-icons/lib/md/arrow-drop-up';
import sortBy from 'lodash/sortBy';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

const Filters = styled(({ hidden, ...props }) => !hidden && <div {...props} />)`
	text-transform: uppercase;
	color: ${({ theme }) => theme.text.secondary};
	font-size: 0.75rem;
	font-weight: 500;
	margin: 20px 0 10px 0;
`;

class Table extends Component {

	getSortLocation = (key) => {
		const { location } = this.props;
		const { sort } = parse(location.search);

		const search = sort === key ? stringify({ sort: `-${key}` }) : stringify({ sort: key });
		return { ...location, search };
	}

	getSortIcon = (key) => {
		const { location } = this.props;
		const { sort } = parse(location.search);
		const iconProps = { width: '1rem', height: '1rem' };
		const up = <MdArrowDropUp {...iconProps} />;
		const down = <MdArrowDropDown {...iconProps} />;

		if (sort === key) return this.getSortActive(key) ? up : down;
		return this.getSortActive(key) ? down : up;
	}

	getSortActive = (key) => {
		const { location } = this.props;
		const { sort } = parse(location.search);
		return sort === key || sort === `-${key}`;
	}

	sortData = (data) => {
		const { defaultSort, location } = this.props;
		const sort = (parse(location.search) || {}).sort || defaultSort;

		if (!sort) return data;
		if (sort[0] === '-') return sortBy(data, [this.sort(sort.substr(1))]).reverse();
		return sortBy(data, [this.sort(sort)]);
	}

	sort = (sort) => (o) => {
		const { columns } = this.props;
		const { value } = find(columns, ['key', sort]) || {};
		return value ? value(o) : o[sort];
	}

	render = () => {
		const { className, columns = [], data: propsData = [], disableSorting, filters, limit, offset, ...props } = this.props;

		let data = this.sortData(propsData).slice(offset || 0, limit || propsData.length);

		return (
			<Fragment>
				<Filters hidden={!filters}>Filter by: { map(filters, (key) => <span>{ key }</span>) }</Filters>
				<table className={className}>
					<thead>
						<tr>{ map(columns, ({ hidden, key, label }) => {
							if (hidden) return null;
							if (disableSorting) return <th key={key}><span>{ label }</span></th>;
							return (
								<th key={key}>
									<Link
										to={this.getSortLocation(key)}
										replace
										data-sort-active={this.getSortActive(key)}
									>{ label }{ this.getSortIcon(key) }</Link>
								</th>
							);
						}) }</tr>
					</thead>
					<tbody>
						{ map(data, (row) => (
							<tr key={row._id}>{ map(columns, ({ format, hidden, key, value }) => {
								if (hidden) return null;
								if (format) return <td key={key}>{ format(value(row), row) }</td>; //FIXME: What if value is not a function?
								if (value) return <td key={key}>{ value(row) }</td>;
								return <td key={key}>{ row[key] }</td>;
							}) }</tr>
						)) }
					</tbody>
				</table>
			</Fragment>
		);
	}
}

export default withRouter(styled(Table)`
	width: 100%;
	text-align: left;
	font-size: 0.875rem;
	border-collapse: collapse;

	thead,
	tbody {
		border-bottom: solid 2px ${({ theme }) => theme.light};
	}

	thead {
		color: ${({ theme }) => theme.text.primary};
		
		a,
		span {
			display: inline-block;
			color: inherit;
			text-decoration: none;
			width: 100%;
			height: 100%;
			padding: 7px 10px;
		}

		a {
			svg {
				visibility: hidden;
				margin-left: 3px;
			}

			:hover,
			&[data-sort-active="true"] {
				background-color: ${({ theme }) => theme.light};
				
				svg {
					visibility: visible;
				}
			}
		}
	}
	
	tbody {
		color: ${({ theme }) => theme.text.secondary};
	}
	
	td {
		padding: 7px 10px;

		span {
			display: flex;
			align-items: center;
		}
	}

	img {
		width: 24px;
		height: 24px;
		border-radius: 50%;

		:not(:only-child) {
			margin-right: 10px;
		}
	}
`);