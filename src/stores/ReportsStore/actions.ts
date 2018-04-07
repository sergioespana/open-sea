import { isNumber, round } from 'lodash';
import { eval as evaluate } from 'mathjs';

export const actions = () => {

	const compute = (value: string, data: object) => roundIfNumber(evaluate(value, data), 2);

	const roundIfNumber = (val: any, precision?: number) => isNumber(val) ? round(val, precision) : val;

	return {
		compute
	};
};
