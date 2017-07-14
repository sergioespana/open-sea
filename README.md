# SEAMan - Socio-environmental auditing manager

## Context

Responsible enterprises perform accordingly to ethical values, taking care of the impact of their activities on society and on the environment, beyond their legal obligations. Every now and then, they want to know whether they are doing well, either to redefine the organisational strategy, to acquire funding from philanthropy investors or ethical banks, to address consumer segments concerned with sustainability, or to reengineer the company. Socio-environmental auditing (SEA) is the process of assessing and reporting the social and environmental effects of a company’s economic actions to particular interest groups within society and to society at large. More and more enterprises are performing SEA themselves or requesting this service from consulting companies.

## Challenges

There exist plenty of SEA methods and measurement frameworks; e.g. Common Good Balance, Fair Trade, Global Reporting Initiative, ISO 26000, ISO 14000. Having a different tool for each approach has many disadvantages. The expenditure of time and money is scattered across many different software projects, eventually affecting the maturity of the technology. Since current SEA tools do not interoperate, an enterprise that wants to conduct two distinct socio-environmental audits has to enter most of the information twice. Many responsible enterprises dream of a tool that is flexible enough to support several SEA methods. And many software developers as well!

## Expected project outcome

In this project, you will engineer the requirements, design and develop the first version of an open-source, model-driven, versatile socio-environmental auditing (SEA) tool. Some of its features and characteristics will be:

 * The tool is web-based.
 * The socio-environmental indicators are defined in a model that is fed into the tool (the indicator model can be an XML file; developing a modeller is out of the scope of this project).
 * The tool will interpret the model and generate the interfaces for data introduction (we are aiming at runtime model interpretation, not offline code generation).
 * The tool enables the user to enter the data.
 * The tool calculates the values of the indicators and produces a basic report that can be printed.
 * The tool stores historic information (so follow-up projects can tackle data analytics).
