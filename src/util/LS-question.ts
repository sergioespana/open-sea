export const questionFormat = (code: string, question: string, help = '',mandatory: boolean = false) => {

	let man = 'N';
	if (mandatory === true) man = 'Y';
	return btoa(
`<document>
<LimeSurveyDocType>Question</LimeSurveyDocType>
<DBVersion>359</DBVersion>
<languages>
	<language>en</language>
</languages>
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
			<qid><![CDATA[51]]></qid>
			<parent_qid><![CDATA[0]]></parent_qid>
			<sid><![CDATA[196463]]></sid>
			<gid><![CDATA[41]]></gid>
			<type><![CDATA[T]]></type>
			<title><![CDATA[${code}]]></title>
			<question><![CDATA[${question}]]></question>
			<preg/>
			<help><![CDATA[${help}]]></help>
			<other><![CDATA[N]]></other>
			<mandatory><![CDATA[${man}]]></mandatory>
			<question_order><![CDATA[2]]></question_order>
			<language><![CDATA[en]]></language>
			<scale_id><![CDATA[0]]></scale_id>
			<same_default><![CDATA[0]]></same_default>
			<relevance><![CDATA[1]]></relevance>
		</row>
	</rows>
</questions>
</document>
`);
};
