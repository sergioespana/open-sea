import { isNullOrUndefined } from 'util';

const getRandomID = () => {
	return Math.floor(Math.random() * Math.floor(9999));
};

const setBegin = () => {
	return (
`<?xml version="1.0" encoding="UTF-8"?>
<document>
 <LimeSurveyDocType>Question</LimeSurveyDocType>
 <DBVersion>360</DBVersion>
 <languages>
  <language>en</language>
 </languages>`
	);
};

const setEnd = () => {
	return (`
</document>`);
};

const setQ = (answertype, code, question, help, other, mandatory, qId, order) => {
	return(`
 <questions>
  <fields>
   <fieldname>qid</fieldname>
   <fieldname>parent_qid</fieldname>
   <fieldname>sid</fieldname>
   <fieldname>gid</fieldname>
   <fieldname>type</fieldname>
   <fieldname>title</fieldname>
   <fieldname>question</fieldname>
   <fieldname>preg</fieldname>
   <fieldname>help</fieldname>
   <fieldname>other</fieldname>
   <fieldname>mandatory</fieldname>
   <fieldname>question_order</fieldname>
   <fieldname>language</fieldname>
   <fieldname>scale_id</fieldname>
   <fieldname>same_default</fieldname>
   <fieldname>relevance</fieldname>
   <fieldname>modulename</fieldname>
  </fields>
  <rows>
   <row>
    <qid><![CDATA[${qId}]]></qid>
    <parent_qid><![CDATA[0]]></parent_qid>
    <sid><![CDATA[774448]]></sid>
    <gid><![CDATA[2]]></gid>
    <type><![CDATA[${answertype}]]></type>
    <title><![CDATA[${code}]]></title>
    <question><![CDATA[${question}]]></question>
    <preg/>
    <help><![CDATA[${help}]]></help>
    <other><![CDATA[${other}]]></other>
    <mandatory><![CDATA[${mandatory}]]></mandatory>
    <question_order><![CDATA[${order}]]></question_order>
    <language><![CDATA[en]]></language>
    <scale_id><![CDATA[0]]></scale_id>
    <same_default><![CDATA[0]]></same_default>
    <relevance><![CDATA[1]]></relevance>
   </row>
  </rows>
 </questions>`);
};

const setSubQ = (subQ, qId) => {
	let count = 0;
	let returnString = '';
	returnString += `
  <subquestions>
  <fields>
   <fieldname>qid</fieldname>
   <fieldname>parent_qid</fieldname>
   <fieldname>sid</fieldname>
   <fieldname>gid</fieldname>
   <fieldname>type</fieldname>
   <fieldname>title</fieldname>
   <fieldname>question</fieldname>
   <fieldname>preg</fieldname>
   <fieldname>help</fieldname>
   <fieldname>other</fieldname>
   <fieldname>mandatory</fieldname>
   <fieldname>question_order</fieldname>
   <fieldname>language</fieldname>
   <fieldname>scale_id</fieldname>
   <fieldname>same_default</fieldname>
   <fieldname>relevance</fieldname>
   <fieldname>modulename</fieldname>
  </fields>
	<rows>`;

	let subcounter = 0;
	subQ.forEach(element => {
		returnString += `
	 <row>
    <qid><![CDATA[${getRandomID()}]]></qid>
    <parent_qid><![CDATA[${qId}]]></parent_qid>
    <sid><![CDATA[774448]]></sid>
    <gid><![CDATA[2]]></gid>
    <type><![CDATA[T]]></type>
    <title><![CDATA[T${subcounter}]]></title>
    <question><![CDATA[${element}]]></question>
    <other><![CDATA[N]]></other>
    <question_order><![CDATA[${subcounter}]]></question_order>
    <language><![CDATA[en]]></language>
    <scale_id><![CDATA[0]]></scale_id>
    <same_default><![CDATA[0]]></same_default>
    <relevance><![CDATA[1]]></relevance>
	 </row>`;
	  subcounter += 1;
	});

	returnString += `
  </rows>
 </subquestions>`;

	return (returnString);
};

const setOptions = (options, qId) => {
	let count = 0;
	let returnString = `
 <answers>
  <fields>
   <fieldname>qid</fieldname>
   <fieldname>code</fieldname>
   <fieldname>answer</fieldname>
   <fieldname>sortorder</fieldname>
   <fieldname>assessment_value</fieldname>
   <fieldname>language</fieldname>
   <fieldname>scale_id</fieldname>
  </fields>
  <rows>`;
	options.forEach(element => {
		returnString += `
   <row>
    <qid><![CDATA[${qId}]]></qid>
    <code><![CDATA[${'A' + count}]]></code>
    <answer><![CDATA[${element}]]></answer>
    <sortorder><![CDATA[${count + 1}]]></sortorder>
    <assessment_value><![CDATA[${count}]]></assessment_value>
    <language><![CDATA[en]]></language>
    <scale_id><![CDATA[0]]></scale_id>
   </row>`;
		count ++;
	});
	returnString += `
  </rows>
	</answers>`;
	return(returnString);
};

export const questionFormat = (code: string, question: string, answertype: string, mandatory: string, order: number, other?: string, help?: string, options?: string, aggregatedQs?: string) => {

	const qId = getRandomID();
	if (isNullOrUndefined(help)) help = '';
	if (isNullOrUndefined(other)) other = 'N';

	let returnString;

	switch (answertype) {
	case 'textHuge': {
		answertype = 'U';
		break;
		 }
	case 'textLong': {
		answertype = 'T';
		break;
	}
	case 'textShort': {
		answertype = 'S';
		break;
		 }
	case 'number': {
		answertype = 'N';
		break;
	}
	case 'instruction': {
		answertype = 'X';
		break;
		 }
	case 'radio': {
		answertype = 'L';
		break;
	}
	case 'enumFivePoint': {
		answertype = '5';
		break;
	}
	case 'dropdown': {
		answertype = '!';
		break;
	}
	case 'multipleChoice': {
		answertype = 'P';
		break;
	}
	case 'date': {
		answertype = 'D';
		break;
	}
	case 'enumGender': {
		answertype = 'G';
		break;
	}
	case 'enumYesNo': {
		answertype = 'Y';
		break;
	}
	}
	returnString = setBegin() + setQ(answertype, code, question, help, other, mandatory, qId, order);

	switch (answertype) {
		// just display text/number -> single question single answer
	case 'U': case 'T': case 'S': case 'N': case 'X': case 'D': case 'G': case 'Y': case '5': {
		returnString += setEnd();
		break;
	}
	//display radio, dropdown, 5point, ranking --> single question single answer
	case 'L': case '!': case 'R': {
		returnString += setOptions(options, qId) + setEnd();
		break;
	}
	//display multiplechoice, where options are sub questions --> multiple sub questions, with single answers
	case 'P': {
		returnString += setSubQ(aggregatedQs, qId) + setEnd();
		break;
	}
	//display array, with predevided options and custom subquestions/aggregatedQs --> multiple sub question with multiple SET answers
	case 'A': case 'C': case 'E': case ':': case ';': {
		returnString += setSubQ(aggregatedQs, qId) + setEnd();
		break;
	}
//display array with custom options and custom subquestions --> multiple sub questions with multiple CUSTOM answers
	case 'F': {
		returnString += setSubQ(aggregatedQs, qId) + setOptions(options, qId) + setEnd();
		break;
	}
	}
	return (btoa(returnString));
};
