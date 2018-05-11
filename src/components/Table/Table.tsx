import { find, isUndefined, map, reject, sortBy, uniq } from 'lodash';
import { parse, stringify } from 'query-string';
import React from 'react';
import MdArrowDown from 'react-icons/lib/md/arrow-drop-down';
import MdArrowUp from 'react-icons/lib/md/arrow-drop-up';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import slugify from 'slugify';
import { LinkButton } from '../Button';
import { FilterSelect } from '../Input';
import { Link } from '../Link';
import TableBody from './TableBody';
import TableBodyCell from './TableBodyCell';
import TableComponent from './TableComponent';
import TableFilterWrapper from './TableFilterWrapper';
import TableHead from './TableHead';
import TableHeadCell from './TableHeadCell';
import TableWrapper from './TableWrapper';

interface Column {
	hidden?: boolean;
	format?: Function;
	key?: string;
	label: string;
	labelHidden?: boolean;
	value?: Function;
}

interface TableProps extends RouteComponentProps<any> {
	columns: Column[];
	data: any[];
	defaultSort?: string;
	filters?: string[];
	limit?: number;
	sortingDisabled?: boolean;
}

const Table: React.StatelessComponent<TableProps> = (props) => {
	const { columns, data: propsData, defaultSort, filters = [], limit, location, sortingDisabled } = props;
	const filteredData = propsData; // TODO: Filter data.
	const sort = parse(location.search).sort || defaultSort;
	const sortedData = sort ? sortCollectionByKey(filteredData, columns, sort) : filteredData;
	const data = limit ? sortedData.slice(0, limit) : sortedData;

	return (
		<TableWrapper>
			{filters.length > 0 && (
				<TableFilterWrapper>
					<h3>Filter by:</h3>
					{map(filters, renderFilter(columns, data, location))}
				</TableFilterWrapper>
			)}
			<TableComponent>
				<TableHead>
					<tr>{map(columns, renderColumnHead(sortingDisabled, location))}</tr>
				</TableHead>
				<TableBody>
					{map(data, renderRow(columns))}
				</TableBody>
			</TableComponent>
		</TableWrapper>
	);
};

export default withRouter(Table);

export const renderFilter = (columns: TableProps['columns'], data: TableProps['data'], location) => (filter) => {
	// TODO: Put ID in URL, but show values. Separate the two.
	// TODO: Support for formatting the items in the select box.
	const column = find(columns, ({ key, label }) => key === filter || slugify(label, { lower: true }) === filter);
	// Get unique values and filter out 'undefined'.
	const values = reject(uniq(map(data, (obj) => {
		const { key, value } = column;
		return value ? value(obj) : obj[key];
	})), isUndefined);
	// Show no filter if there's only one value to pick from.
	if (values.length <= 1) return null;
	// Otherwise, get the filter type and display the appropriate
	// input.
	const type = getFilterType(values);
	switch (type) {
	case 'none': return null;
	case 'select': return (
		<FilterSelect
			key={filter}
			label={column.label}
			options={map(values, (value) => ({
				value,
				to: getFilterLocation(location, filter, value)
			}))}
			resetLocation={{ ...location, search: stringify({ ...parse(location.search), [filter]: undefined }) }}
			value={parse(location.search)[filter]}
		/>
	);
	case 'toggle': return (
		<LinkButton
			appearance="subtle"
			key={filter}
			selected={parse(location.search)[filter] === 'true'}
			to={getFilterLocation(location, filter)}
		>
			{column.label}
		</LinkButton>);
	}
};

export const getFilterType = (values): 'toggle' | 'select' | 'none' => {
	const types = uniq(map(values, (val) => typeof val));
	// Mixed types including a boolean value. Can't filter that.
	if (types.length > 1 && types.includes('boolean')) return 'none';
	// Only boolean values, return toggle.
	if (types.length === 1 && types[0] === 'boolean') return 'toggle';
	// Otherwise, a select box will suffice.
	return 'select';
};

export const getFilterLocation = (location: any, key: string, value?: string) => {
	const search = parse(location.search);
	const newValue = value || (search[key] === 'true' ? undefined : true);
	return { ...location, search: stringify({ ...search, [key]: newValue }) };
};

export const sortCollectionByKey = (collection: any[], columns: Column[], sort: string): any[] => {
	const ascending = sort[0] !== '-';
	const sortKey = ascending ? sort : sort.substr(1);
	const column = find(columns, ({ key, label }) => key === sortKey || slugify(label, { lower: true }) === sortKey);
	const sorted = sortBy(collection, (obj) => {
		const { key, value } = column;
		return value ? value(obj) : obj[key];
	});
	return ascending ? sorted : sorted.reverse();
};

export const getSortLocation = (location: any, key: string) => {
	const search = parse(location.search);
	const sort = search.sort === `-${key}` ? undefined : search.sort === key ? `-${key}` : key;
	return { ...location, search: stringify({ ...search, sort }) };
};

export const renderColumnHead = (sortingDisabled: TableProps['sortingDisabled'], location: any) => (column: Column) => {
	const { hidden, key, label, labelHidden } = column;
	// Hide column completely.
	if (hidden) return null;
	// Hide just the label (we'll render the values below).
	if (labelHidden) return <TableHeadCell key={key} />;
	// Determine which sort icon to render.
	const search = parse(location.search);
	const sortKey = key || slugify(label, { lower: true });
	const searchIconProps = { height: 16, viewBox: '0 0 40 40', width: 16 };
	const sortIcon = search.sort === `-${sortKey}`
		? <MdArrowDown {...searchIconProps} />
		: search.sort === sortKey
			? <MdArrowUp {...searchIconProps} />
			: <svg {...searchIconProps} />;
	// Render the head item.
	return sortingDisabled ? (
		<TableHeadCell key={key}><span>{label}{sortIcon}</span></TableHeadCell>
	) : (
		<TableHeadCell key={key}>
			<Link
				aria-current={search.sort === `-${sortKey}` || search.sort === sortKey}
				key={key}
				tabIndex={-1}
				to={getSortLocation(location, sortKey)}
			>
				{label}{sortIcon}
			</Link>
		</TableHeadCell>
	);
};

export const renderColumnValue = (obj: any) => (column: Column) => {
	const { format, hidden, key, label, value } = column;
	if (hidden) return null;
	// Compute the actual value.
	const computed = value ? value(obj) : obj[key];
	// Generate a unique key for the cell to keep React from complaining.
	const reactKey = [obj._id, slugify(label, { lower: true })].join('_');
	// Render the cell, either by just outputting the value or by calling
	// the format function.
	return <TableBodyCell key={reactKey}>{format ? format(computed, obj) : computed}</TableBodyCell>;
};

export const renderRow = (columns: TableProps['columns']) => (row: any) => (
	<tr key={row._id}>{map(columns, renderColumnValue(row))}</tr>
);
