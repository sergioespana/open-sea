import { map } from 'lodash';
import * as ss from 'simple-statistics';
import { isNullOrUndefined } from 'util';
import { requestImplement } from './lime-api';

export const getResponses = async (organisation, survey) => {
	try {
		const res = await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'export_responses',[survey.lsId, 'json']);
		if (res.status === 'No Data, could not get max id.') {
			return null;
		} else {
			const result = JSON.parse(atob(res));
			//console.log(result);
			//console.log(result);
			//create response object 
			map(survey.questions, ({}, qId) => {
				survey.questions[qId].responses = [];
			});
			// push responses to database
			for (let i = 0; i < result.responses.length; i++) {
				// this to calculate question
				map(survey.questions, ({ aggregatedQs, options, answerType }, qId) => {
					if (answerType === 'instruction') return null;
					else if (aggregatedQs) {
						map(aggregatedQs, (values, id) => {
							if (result.responses[i][i + 1][`${qId}[T${id}]`]) survey.questions[qId].responses.push(values);
						});
						//result.responses[i][i + 1][`${qId}[T${}]`]
					} else if (options) {
						map(options, (values, id) => {
							if (result.responses[i][i + 1][qId] === `A${id}`) survey.questions[qId].responses.push(values);
						});
					} else survey.questions[qId].responses.push(result.responses[i][i + 1][qId]);
				});
			}
		}
	} catch (err) {
		console.log(err);
	}
	return(survey);
};

export const getValue = (qObject, statistics) => {
	// this only handles one survey, not the collection of multiple
	if (isNullOrUndefined(qObject)) return;
	let val;
	let str = '';
	const responsesInt = [];

	// create lists with values on which calculations (mean etc.) can be performed
	map(qObject, ({ responses, answerType, options }, qId) => {
		//console.log(qId);
		//console.log(answerType);
		//console.log(responses);
		if (responses) for (let index = 0; index < responses.length; index++) {
			if (responses[index])
				switch (answerType) {
				case 'textHuge' : {
					str += responses[index] + '\n';
					break;
				}
				case 'textLong' : {
					str += responses[index] + '\n';
					break;
				}
				case 'textShort' : {
					str += responses[index] + '\n';
					break;
				}
				case 'dropdown' : {
					console.log(responses[index]);
					responsesInt[index] = responses[index];
					break;
				}
				case 'radio' : {
					console.log(responsesInt[index]);
					responsesInt[index] = responses[index];
					break;
				}
				case 'number' : {
					responsesInt[index] = parseInt(responses[index]);
					break;
				}
				case 'enumFivePoint' : {
					responsesInt[index] = parseInt(responses[index]);
					break;
				}
				case 'enumGender' : {
					responsesInt[index] = responses[index];
					break;
				}
				case 'enumYesNo' : {
					responsesInt[index] = responses[index];
					break;
				}
				case 'multipleChoice' : {
					responsesInt[index] = responses[index];
					break;
				}
				case 'date' : {
					responsesInt[index] = new Date(responses[index]);
					break;
				}

				}
		}

		if (str) val = str; else {
			const responseInt2 = responsesInt.filter(function (element) {
				return element !== undefined;
	 		});
			switch (statistics) {
			case 'mean': {
				val = ss.mean(responseInt2);
				break;
			}
			case 'median': {
				val = ss.median(responseInt2);
				break;
			}
			case 'mode': {
				val = ss.mode(responsesInt);
				break;
			}
			case 'sum': {
				val = ss.sum(responseInt2);
				break;
			}
			case 'maximum': {
				val = ss.max(responsesInt);
				break;
			}
			case 'minimum': {
				val = ss.min(responsesInt);
				break;
			}
			}

			switch (answerType) {
			case 'number' || 'enumFivePoint': {
				break;
			}
			case 'date': {
				const d = new Date();
				//calculate date difference with today -> to do formula in days
				const diffdate = Math.floor((Date.UTC(val.getFullYear(), val.getMonth(), val.getDate()) - Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) ) /(1000 * 60 * 60 * 24))
				if (diffdate === 0) val = '0';
				else val = diffdate;
				break;
			}
			case 'dropdown': {
				val = val.slice(0, -1);
				break;
			}
			case 'radio': {
				val = val.slice(0, -1);
				break;
			}
			case 'multipleChoice': {
				val = val.slice(0, -1);
				break;
			}
			case 'enumYesNo': {
				if (val === 'Y') val = 'yes'; else val = 'no';
				break;
			}
			case 'enumGender': {
				if (val === 'M') val = 'man'; else val = 'woman';
				break;
			}
			}
		}
	});

	console.log(val);

	return val;
};
