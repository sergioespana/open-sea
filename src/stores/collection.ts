import { find, findIndex, isString } from 'lodash';
import { action } from 'mobx';
import { removePrivates } from './helpers';

export default (collection: Array<any>, idKey: string = '_id', name: string = 'Collection') => {

	const throwIfExists = (toFind: string | object) => {
		if (findIndexById(toFind) > -1) throw new Error('Object already exists!');
	};

	const throwIfNotExists = (toFind: string | object) => {
		if (findIndexById(toFind) < 0) throw new Error('Object does not exist!');
	};

	const clear = action(() => collection.splice(0, collection.length));

	const findById = action((toFind: string | object) => find(collection, { [idKey]: isString(toFind) ? toFind : toFind[idKey] }));

	const findByIndex = action((toFind: number) => collection[toFind]);

	const findIndexById = action((toFind: string | object) => findIndex(collection, { [idKey]: isString(toFind) ? toFind : toFind[idKey] }));

	const updateOrInsert = action((toUpdateOrInsert: object) => findIndexById(toUpdateOrInsert) > -1 ? update(toUpdateOrInsert) : insert(toUpdateOrInsert));

	const insert = action((toInsert: object, index?: number) => {
		throwIfExists(toInsert);

		if (index) collection.splice(index, 1, toInsert);
		else collection.push(toInsert);

		return toInsert;
	});

	const insertAt = action((toInsert: object, index: number) => insert(toInsert, index));

	const remove = action((toRemove: string | object) => {
		throwIfNotExists(toRemove);

		const index = findIndexById(toRemove);
		collection.splice(index, 1);

		return toRemove;
	});

	const update = action((toUpdate: any) => {
		throwIfNotExists(toUpdate);

		const index = findIndexById(toUpdate);
		const original = findById(toUpdate);
		collection.splice(index, 1, { ...original, ...removePrivates(toUpdate) });

		return toUpdate;
	});

	return {
		$collection: {
			name
		},
		clear,
		findById,
		findByIndex,
		findIndexById,
		insert,
		insertAt,
		remove,
		update,
		updateOrInsert
	};
};
