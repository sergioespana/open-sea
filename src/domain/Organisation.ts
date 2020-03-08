export interface Requirement {
	_computed?: number;
	_pass?: boolean;
	indicator: string;
	operator: '>' | '>=' | '<' | '<=' | '==';
	value: string | number;
}

export interface Certification {
	_index?: number;
	_pass?: boolean;
	colour?: string;
	description?: string;
	level?: number;
	name: string;
	requirements: Requirement[];
}

export interface Topic {
	name: string;
}

export interface Indicator {

}

export interface IndirectIndicator {

}

export interface DirectIndicator {

}

export interface Model {
	_id: string;
	topics?: Topic[];
	certifications?: Certification[];
	indicators: Indicator[];
	indirectIndicators: IndirectIndicator[];
	directIndicators: DirectIndicator[];
	surveys?: Survey[];
	name: string;
	reportItems?: Array<any>;
}

export interface Specification {
}

export interface Stakeholdergroup {
	_id: string;
	_orgId: string;
	_sgId: string;
	name: string;
	created: Date;
}

export interface Stakeholder {
	_id: string;
	_orgId: string;
	_sId: string;
	sgId: string;
	name: string;
	firstname: string;
	lastname: string;
	email: string;
}

export interface Report {
	_id: string;
	_orgId: string;
	_repId: string;
	created: Date;
	data?: object;
	model?: Model;
	surveyresponses?: SurveyResponse[];
	name: string;
}

export interface SurveyResponse {
	_id: string;
	_orgId: string;
	_repId: string;
	_sId: string;
	summary: string;
	questionresponses?: QuestionResponse[];
}

export interface QuestionResponse {
	_qId: string;
	values: object;  // array?
}

export interface Infographic {
	_id: string;
	_orgId: string;
	_infographicId: string;
	_repId: string;
	created: Date;
	name: string;
	specification?: Specification;
}

export interface Survey {
	_id: string;
	_orgId: string;
	_repId: string;
	_sId: string;
	created: Date;
	name: string;
	description: string;
	welcometext: string;
	closingtext: string;
	questions: Question[];
}

export interface Question {
 	_qId: string;
	name: string;
	description?: string;
	isMandatory: boolean;
	answerType?: string; // for now string and not mandatory, future object or new instance?
}

export interface Organisation {
	_id: string;
	_organisations: Organisation[];
	_reports: Report[];
	_infographics?: Infographic[];
	_stakeholdergroups?: Stakeholdergroup[];
	_stakeholders?: Stakeholder[];
	avatar: string;
	created: Date;
	description: string;
	isPublic?: boolean;
	isNetwork?: boolean;
	model?: Model;
	name: string;
	specification?: Specification;
	ls_account?: string;
	ls_password?: string;
	ls_host?: string;
}
