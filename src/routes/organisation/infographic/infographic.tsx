import { get, isEmpty, map } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MdEdit, MdMoreHoriz } from 'react-icons/md';
import { Redirect, withRouter } from 'react-router-dom';
import { Button, LinkButton } from '../../../components/Button';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { Menu, MenuOption } from '../../../components/Menu';
import { Section } from '../../../components/Section';
import collection from '../../../stores/collection';
import { getYear } from 'date-fns';
import { values } from 'mobx';


interface State {
	showModal: boolean;
}

@inject(app('OrganisationsStore', 'InfographicsStore', 'UIStore'))
@observer
class OrganisationInfographicOverview extends Component<any, State> {
	state: State = {
		showModal: false
	};

	render () {
		const { match: { params: { orgId, infographicId } }, OrganisationsStore, InfographicsStore } = this.props;
		const organisation = OrganisationsStore.findById(orgId);
		const infographic = collection(organisation._infographics).findById(`${orgId}/${infographicId}`);
		const specification = get(infographic, 'specification');
		
		const PageHead = (
			<Header
				title={infographic.name}
				headTitle={`${organisation.name} / ${infographic.name}`}
				breadcrumbs={[
					<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
					<Link key={`/${orgId}/infographics`} to={`/${orgId}/infographics`}>Infographics</Link>
				]}
			>
				{!isEmpty(specification) && <LinkButton appearance="light" to={`/${orgId}/infographics/${infographicId}/data`}><MdEdit height={20} width={20} /></LinkButton>}
				{!isEmpty(specification) && <Menu position="bottom-left" trigger={<Button appearance="light"><MdMoreHoriz height={20} width={20} /></Button>}>
					<MenuOption>Share link</MenuOption>
					<MenuOption>Print</MenuOption>
					<MenuOption>Download as JPG</MenuOption>
				</Menu>}
			</Header>
		);

		// No specification -> redirect
		if (isEmpty(specification)) return <Redirect to={`/${orgId}/infographics/${infographicId}/specification`} />;
		
		// Standard variables for infographics | export to other part
		var standardcolor = ["#fde23e","#f16e23", "#666666","#937e88","#134e88", "#11a9aa","#356e88"];
		var StandardInfographicSize = "700x1020";
		var StandardInfographicBgColor = "#ffffff";

		var StandardHeadBgColor = "#b3d5f7";
		var StandardHeadHeight = 150;
		var StandardHeadPosition = "0x0";

		var StandardHeadTitleTextColor = "#000000";
		var StandardHeadTitleTextFont = "bold 22px sans-serif";
		var StandardHeadTitleTextValue = "Example title infographic +organisation+ +report+";
		var StandardHeadTitleTextMaxWidth = 580;
		var StandardHeadTitleTextPosition = "50x70";

		var StandardHeadSubtitleTextColor = "#000000";
		var StandardHeadSubtitleTextFont = "18px sans-serif";
		var StandardHeadSubtitleTextValue = "Example subtitle infographic";
		var StandardHeadSubtitleTextMaxWidth = 580;
		var StandardHeadSubtitleTextPosition = "50x100";

		var StandardFootBgColor = "#b3d5f7";
		var StandardFootHeight = 100;
		var StandardFootTextValue = 'Copyright +organisation+ +year+ - Data is based on report +report+';

		var StandardBoxBgColor = "#ffffff";
		var StandardBoxSize = "600x200";

		var StandardTextColor = "#000000";
		var StandardTextFont = "12px sans-serif";
		var StandardTextValue = "Oops! No text input";
		var StandardTextMaxWidth = 285;
		var StandardTextLineHeight = 0; 
		var StandardTextAlign = "start"; 
		
		var StandardTitleTextColor = "darkblue";
		var StandardTitleTextFont = "bold 16px sans-serif";
		var StandardTitleTextValue = "Oops! No text input";
		var StandardTitleTextMaxWidth = 500;
		var StandardTitleTextLineHeight = 0; 

		var StandardBarChartBgColor = "#ffffff";
		var StandardBarChartGridScale = 25;
		var StandardBarChartPadding = 10;
		var StandardBarChartSize = "300x200";
		var StandardBarChartTitle = "Bar Chart Title";
		var StandardBarChartShowLegend = "y";
		var StandardBarChartShowTitle = "y";
		var StandardBarChartShowGrid = "y";

		var StandardPieChartBgColor = "#ffffff";
		var StandardPieChartPadding = 10;
		var StandardPieChartTitle = "Pie Chart Title";
		var StandardPieChartSize = 100;
		var StandardPieChartShowPercentage = "y";
		var StandardPieChartShowLegend = "y";
		var StandardPieChartShowTitle = "y";
		var StandardPieChartType = "pie";

		var StandardPictureGraphBgColor = "#ffffff";
		var StandardPictureGraphPadding = 10;
		var StandardPictureGraphTitle = "Picturegraph Title";
		var StandardPictureGraphSize = "100x100";
		var StandardPictureGraphItemLabelBin = "kg";
		var StandardPictureGraphItemLabelElectric = "kWh";
		var StandardPictureGraphShowLegend = "y";
		var StandardPictureGraphShowTitle = "y";

		// General functions
		function SplitSizePosition(string) {
			string = string.split('x');
			return string;
		}

		function IsHexCode(string) {
			var RegExp = /^[0-9A-F]{6}$/i; 
			return RegExp.test(string);
		}

		function IsImageUri(string) {
			var RegExpImagePattern = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/gi;
			return RegExpImagePattern.test(string);
		}

		function ReplaceSpecialWords(string) {
			string = string.replace('+organisation+', orgId.charAt(0).toUpperCase() + orgId.slice(1));
			string = string.replace('+report+', infographic.report.substring(infographic.report.indexOf('/')+1));
			string = string.replace('+year+', getYear(new Date()));
			return string;
		}

		function loadImage(url) {
			return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
		}

		// Function for charts, calculating values of indicators in an array and returning an array of data
		function calculateChartData(ChartDataInput) {
			var report = collection(organisation._reports).findById(`${infographic.report}`);
			var data = get(report, 'data');
			var model = get(report, 'model');
			// var items = get(model, 'reportItems');
			var indicators = get(model, 'indicators');

			var ChartDataOutput = new Array();
			for(var ChartDataItem in ChartDataInput) {
				var ChartDataItemValue = ChartDataInput[ChartDataItem];

				// RegExp for 1950-2050#S1-100
				var RegExpMultipleReports = /(19[5-9]\d|20[0-4]\d|2050)#(S0*[1-9][0-9]?$|^S100)$/gi;

				// RegExp for S1-100
				var RegExpIndicator = /S0*[1-9][0-9]?$|^S100/gi;

				// Linking to an indicator in another report
				if(RegExpMultipleReports.test(ChartDataInput[ChartDataItem]) == true) {
					var RegExpFound = ChartDataItemValue.match(RegExpMultipleReports);
					var reportFound = RegExpFound[0].split('#')[0];
						
					var otherReport = collection(organisation._reports).findById(organisation.name.toLowerCase() +"/"+ reportFound);
					if(otherReport == undefined) break;

					var otherData = get(otherReport, 'data');
					var otherModel = get(otherReport, 'model');
					// var otherItems = get(otherModel, 'reportItems');
					var otherIndicators = get(otherModel, 'indicators');
						
					var indicatorFound = RegExpFound[0].split('#')[1];
					var indicatorFound_check = get(otherIndicators, indicatorFound);

					// console.log("Report: "+ reportFound +" Indicator: "+ indicatorFound);

					if(indicatorFound_check != undefined && indicatorFound_check.type != "text") {
						ChartDataItemValue = ChartDataItemValue.replace(reportFound +"#"+ indicatorFound, InfographicsStore.compute(indicatorFound_check.value, otherData));
					}
					else{ break; }
				}
					
				// Linking to an indicator in this report
				else if(RegExpIndicator.test(ChartDataInput[ChartDataItem]) == true) {
					var indicatorFound = ChartDataItemValue.match(RegExpIndicator);
					var indicatorFound_check = get(indicators, indicatorFound[0]);
						
					if(indicatorFound_check != undefined && indicatorFound_check.type != "text") {
						ChartDataItemValue = ChartDataItemValue.replace(indicatorFound[0], InfographicsStore.compute(indicatorFound_check.value, data));
					}
					else { break; }
				}
				ChartDataOutput[ChartDataItem] = eval(ChartDataItemValue);
				// console.log(ChartDataItem +" & "+ ChartDataItemValue);
			}
			return ChartDataOutput;
		}

		// Defining the bgsize and bgcolor
		var infographic_size = specification.bgsize;
		if(infographic_size == undefined || infographic_size == "0" || infographic_size == "auto") { infographic_size = StandardInfographicSize; }
		infographic_size = SplitSizePosition(infographic_size);

		var infographic_bgimage = specification.bgimage;
		var infographic_bgcolor = specification.bgcolor;
		var infographic_bgpattern = specification.bgpattern;
		if((infographic_bgpattern == undefined && infographic_bgimage == undefined && infographic_bgcolor == undefined) || ((infographic_bgimage != undefined && infographic_bgpattern != undefined) && infographic_bgcolor == undefined) ) { infographic_bgcolor = StandardInfographicBgColor; }
		else if (infographic_bgcolor == "0") infographic_bgcolor = "#000000";
		else if (IsHexCode(infographic_bgcolor) == true) { infographic_bgcolor = "#"+ infographic_bgcolor; }
		
		var InfographicBasic = specification.type;

		if(InfographicBasic == "basic") {
			var report = collection(organisation._reports).findById(`${infographic.report}`);
			var model = get(report, 'model');
			var items = get(model, 'reportItems');
			var data = get(report, 'data');

			infographic_bgcolor = "#eeeeee";
			if(items == undefined) var infographic_height = 100; else var infographic_height = 50 + items.length*65 + 40 + 10;
			infographic_size = "500x"+ infographic_height;
			infographic_size = SplitSizePosition(infographic_size);
		}

		async function initializeCanvas() {
			var canvas = document.getElementById('canvas') as HTMLCanvasElement;
			var context = canvas.getContext('2d');

			context.beginPath();


			// BASIC INFOGRAPHIC LOOKING LIKE A REPORT - USE type: basic TO SEE
			if(InfographicBasic == "basic") {				

				// Draw background color
				context.fillStyle = infographic_bgcolor;
				context.fillRect(0, 0, Number(infographic_size[0]), infographic_height);
				context.fill();
				
				// Draw logo
				var img_logo = new Image();
				img_logo.src = organisation.avatar;
				var img_logoSize = "100x60";
				img_logoSize = SplitSizePosition(img_logoSize);

				context.drawImage(img_logo, infographic_size[0] - Number(img_logoSize[0]) - 30, 35, Number(img_logoSize[0]), Number(img_logoSize[1]));

				// Draw title
				context.fillStyle = "#000000";
				context.font = "600 18px Segoe UI"
				context.fillText(orgId.charAt(0).toUpperCase() + orgId.slice(1) +" - Report: "+ infographic.report.substring(infographic.report.indexOf('/')+1), 15, 40, infographic_size[0]-30);
				
				// Draw reportitems
				if(items != undefined) {
					for(var i=0; i<items.length;i++){
						var item = items[i];

						if(item == undefined) break;

						context.fillStyle = "#707070";
						context.font = "600 13px Segoe Ui";
						context.fillText(item.name.toUpperCase(), 15, 80 + i*65, infographic_size[0]-30);
						
						context.fillStyle = "#000000";
						context.font = "13px Segoe Ui";
						var itemValue = InfographicsStore.compute(model.indicators[item.value].value, data);
						if(model.indicators[item.value].type == "percentage") itemValue = itemValue +"%";
						context.fillText(itemValue, 15, 110 + i*65, infographic_size[0]-30);
					}
				}

				// Draw Footer
				var footer_height = 12;
				context.fillStyle = "#1c1c1c";
				context.fillRect(0, infographic_height - footer_height, infographic_size[0], footer_height);
				context.fill();

				context.fillStyle = "#d1d1d1";
				context.font = "9px Segoe Ui";
				context.textAlign = "center";
				context.fillText("© Copyright "+ orgId.charAt(0).toUpperCase() + orgId.slice(1) +" "+ getYear(new Date()), infographic_size[0]/2, infographic_height-3, infographic_size[0]);
				context.fill();

				context.textAlign = "start";
			}

			// ALL FUNCTIONALITIES INFOGRAPHIC
			else {
				// Draw background check for bgimage, bgcolor, bgpattern. Select bgcolor over everything and select bgcolor when bgimage and bgpattern are set
				if (infographic_bgimage != undefined && infographic_bgpattern == undefined && infographic_bgcolor == undefined) {
					var img_bgimage = new Image();
					img_bgimage.src = infographic_bgimage;

					if(IsImageUri(img_bgimage.src)){
						// Load image before
						var img = await loadImage(img_bgimage.src);

						context.drawImage(img_bgimage, 0, 0);
						context.fill();
					}
				}

				else if(infographic_bgpattern != undefined && infographic_bgimage == undefined && infographic_bgcolor == undefined) {
					var img_pattern = new Image();

					if(IsImageUri(infographic_bgpattern) == true) img_pattern.src = infographic_bgpattern;
					else img_pattern.src = '/assets/images/pattern/'+ infographic_bgpattern +'.png';

					// Load image before
					var img = await loadImage(img_pattern.src);

					context.fillStyle = context.createPattern(img_pattern, 'repeat');
					context.fillRect(0, 0, infographic_size[0], infographic_size[1]);
					context.fill();
				}

				else if(infographic_bgcolor != undefined || (infographic_bgimage != undefined && infographic_bgpattern != undefined)) {
					context.fillStyle = infographic_bgcolor;
					context.fillRect(0, 0, infographic_size[0], infographic_size[1]);
					context.fill();
				}

				// Check for headsection and draw
				var head = specification.head;
				if (head == "off") { }
				else if(head == undefined || head == "auto") { 
					head = "";
					var head_width = infographic_size[0];
					var head_height = StandardHeadHeight;
					var head_bgcolor = StandardHeadBgColor;
					var head_position = StandardHeadPosition;
					head_position = SplitSizePosition(head_position);

					context.fillStyle = head_bgcolor;
					context.fillRect(Number(head_position[0]), Number(head_position[1]), head_width, head_height);
					context.fill();
				}
				else {
					var head_bgimage = head.bgimage;
					head_bgcolor = head.bgcolor;
					var head_bgpattern = head.bgpattern;
					if((head_bgpattern == undefined && head_bgimage == undefined && head_bgcolor == undefined) || ((head_bgimage != undefined && head_bgpattern != undefined) && head_bgcolor == undefined)) { head_bgcolor = StandardHeadBgColor; }
					else if (head_bgcolor == "0") head_bgcolor = "#000000";
					else if(head_bgcolor == "off") head_bgcolor = "#";
					else if (IsHexCode(head_bgcolor) == true) { head_bgcolor = "#"+ head_bgcolor; }

					var head_size = head.size;
					if(head_size == undefined || head_size == "0" || head_size == "auto") { head_size = infographic_size[0] +"x"+ StandardHeadHeight; }
					head_size = SplitSizePosition(head_size);
					head_width = head_size[0]; 
					head_height = head_size[1];

					head_position = head.position;
					if(head_position == undefined || head_position == "auto" || head_position =="0") { head_position = StandardHeadPosition; }
					head_position = SplitSizePosition(head_position);

					if(head_bgimage != undefined && head_bgpattern == undefined && head_bgcolor == undefined) {
						var img_headbgimage = new Image();
						img_headbgimage.src = head_bgimage;

						if(IsImageUri(img_headbgimage.src)){
							// Load image before
							var img = await loadImage(img_headbgimage.src);

							context.drawImage(img_headbgimage, Number(head_position[0]), Number(head_position[1]), Number(head_width), Number(head_height));
							context.fill();
						}
					}

					else if(head_bgpattern != undefined && head_bgimage == undefined && head_bgcolor == undefined) {
						var img_headpattern = new Image();

						if(IsImageUri(head_bgpattern) == true) img_headpattern.src = head_bgpattern;
						else img_headpattern.src = '/assets/images/pattern/'+ head_bgpattern +'.png';

						// Load image before
						var img = await loadImage(img_headpattern.src);

						context.fillStyle = context.createPattern(img_headpattern, 'repeat');
						context.fillRect(Number(head_position[0]), Number(head_position[1]), Number(head_width), Number(head_height));
						context.fill();
					}

					else if(head_bgcolor != undefined || (head_bgimage != undefined && head_bgpattern != undefined)) {
						context.fillStyle = head_bgcolor;
						context.fillRect(Number(head_position[0]), Number(head_position[1]), Number(head_width), Number(head_height));
						context.fill();
					}
				}

				// Check for title text in section head and draw title  
				var head_titleText = head.title;

				if(head_titleText == "off" || head == "off") { }
				else if(head_titleText == undefined) {
					var head_titleTextColor = StandardHeadTitleTextColor;
					var head_titleTextFont = StandardHeadTitleTextFont;
					var head_titleTextMaxWidth = StandardHeadTitleTextMaxWidth;
					var head_titleTextPosition = SplitSizePosition(StandardHeadTitleTextPosition);
					var head_titleTextValue = StandardHeadTitleTextValue;
					head_titleTextValue = ReplaceSpecialWords(head_titleTextValue);

					context.fillStyle = head_titleTextColor;
					context.font = head_titleTextFont;
					context.fillText(head_titleTextValue, Number(head_titleTextPosition[0]), Number(head_titleTextPosition[1]), head_titleTextMaxWidth);
				}

				else {
					head_titleTextColor = head_titleText.color;
					if(isEmpty(head_titleTextColor)) head_titleTextColor = StandardHeadTitleTextColor;
					else if(head_titleTextColor == "0") head_titleTextColor = "#000000";
					else if (IsHexCode(head_titleTextColor) == true) { head_titleTextColor = "#"+ head_titleTextColor; }

					head_titleTextFont = head_titleText.font;
					if (isEmpty(head_titleTextFont)) { head_titleTextFont = StandardHeadTitleTextFont;}

					head_titleTextValue = head_titleText.value;
					if(isEmpty(head_titleTextValue)) { head_titleTextValue = StandardHeadTitleTextValue; }
					head_titleTextValue = ReplaceSpecialWords(head_titleTextValue);

					head_titleTextMaxWidth = head_titleText.maxwidth;
					if(head_titleTextMaxWidth == undefined) { head_titleTextMaxWidth = StandardHeadTitleTextMaxWidth; }

					head_titleTextPosition = head_titleText.position;
					if(isEmpty(head_titleTextPosition)) { head_titleTextPosition = SplitSizePosition(StandardHeadTitleTextPosition); }
					else {head_titleTextPosition = SplitSizePosition(head_titleText.position);}

					var head_titleTextAlign = head_titleText.align;
					if(head_titleTextAlign == "center" || head_titleTextAlign == "left" || head_titleTextAlign == "right") context.textAlign = head_titleTextAlign;
					else context.textAlign = "start";

					context.fillStyle = head_titleTextColor;
					context.font = head_titleTextFont;
					context.fillText(head_titleTextValue, Number(head_titleTextPosition[0]), Number(head_titleTextPosition[1]), head_titleTextMaxWidth);

					context.textAlign = "start";
				}

				// Check for subtitle text in section head and draw subtitle  
				var head_subtitleText = head.subtitle;
				
				if (head_subtitleText == "off" || head == "off") {}
				else if(head_subtitleText == undefined) {
					var head_subtitleTextColor = StandardHeadSubtitleTextColor;
					var head_subtitleTextFont = StandardHeadSubtitleTextFont;
					var head_subtitleTextMaxWidth = StandardHeadSubtitleTextMaxWidth;
					var head_subtitleTextPosition = SplitSizePosition(StandardHeadSubtitleTextPosition);
					var head_subtitleTextValue = StandardHeadSubtitleTextValue;
					head_subtitleTextValue = ReplaceSpecialWords(head_subtitleTextValue);

					context.fillStyle = head_subtitleTextColor;
					context.font = head_subtitleTextFont;
					context.fillText(head_subtitleTextValue, Number(head_subtitleTextPosition[0]), Number(head_subtitleTextPosition[1]), head_subtitleTextMaxWidth);
				}
				else {
					head_subtitleTextColor = head_subtitleText.color;
					if(isEmpty(head_subtitleTextColor)) head_subtitleTextColor = StandardHeadSubtitleTextColor; 
					else if (head_subtitleTextColor == "0") head_subtitleTextColor = "#000000";
					else if (IsHexCode(head_subtitleTextColor) == true) head_subtitleTextColor = "#"+ head_subtitleTextColor;

					head_subtitleTextFont = head_subtitleText.font;
					if (isEmpty(head_subtitleTextFont)) { head_subtitleTextFont = StandardHeadSubtitleTextFont;}

					head_subtitleTextValue = head_subtitleText.value;
					if(head_subtitleTextValue == "off") {head_subtitleTextValue = " "}
					if(isEmpty(head_subtitleTextValue)) { head_subtitleTextValue = StandardHeadSubtitleTextValue; }
					head_subtitleTextValue = ReplaceSpecialWords(head_subtitleTextValue);

					head_subtitleTextMaxWidth = head_subtitleText.maxwidth;
					if(head_subtitleTextMaxWidth == undefined) { head_subtitleTextMaxWidth = StandardHeadSubtitleTextMaxWidth; }

					head_subtitleTextPosition = head_subtitleText.position;
					if(isEmpty(head_subtitleTextPosition)) { head_subtitleTextPosition = SplitSizePosition(StandardHeadSubtitleTextPosition); }
					else {head_subtitleTextPosition = SplitSizePosition(head_subtitleText.position);}

					var head_subtitleTextAlign = head_subtitleText.align;
					if(head_subtitleTextAlign == "center" || head_subtitleTextAlign == "left" || head_subtitleTextAlign == "right") context.textAlign = head_subtitleTextAlign;
					else context.textAlign = "start";

					context.fillStyle = head_subtitleTextColor;
					context.font = head_subtitleTextFont;
					context.fillText(head_subtitleTextValue, Number(head_subtitleTextPosition[0]), Number(head_subtitleTextPosition[1]), head_subtitleTextMaxWidth);
				}

				
				//  Draw logo | position & size required
				var logo = get(head, 'logo');

				if(!isEmpty(logo)){
					var logo_position = SplitSizePosition(logo.position);
					var logo_size = SplitSizePosition(logo.size); 

					var img_logo = new Image();
					img_logo.src = organisation.avatar;
					// img_logo.crossOrigin = "Anonymous";

					context.drawImage(img_logo, logo_position[0], logo_position[1], logo_size[0], logo_size[1]);
				}

				// Check for footsection and draw
				var foot = specification.foot;
				if(foot == "off") {	}
				else if(foot == undefined || foot == "auto") { 
					foot = "";
					var foot_width = infographic_size[0];
					var foot_height = StandardFootHeight;
					var foot_bgcolor = StandardFootBgColor;

					context.fillStyle = foot_bgcolor;
					context.fillRect(0, infographic_size[1] - foot_height, foot_width, foot_height);
					context.fill();
				}
				
				else {
					var foot_bgimage = foot.bgimage;
					foot_bgcolor = foot.bgcolor;
					var foot_bgpattern = foot.bgpattern;

					if((foot_bgpattern == undefined && foot_bgimage == undefined && foot_bgcolor == undefined) || ((foot_bgimage != undefined && foot_bgpattern != undefined) && foot_bgcolor == undefined)) { foot_bgcolor = StandardFootBgColor; }
					else if (foot_bgcolor == "0") foot_bgcolor = "#000000";
					else if (IsHexCode(foot_bgcolor) == true) { foot_bgcolor = "#"+ foot_bgcolor; }
			
					var foot_size = foot.size;
					if(foot_size == undefined || foot_size == "0" || foot_size == "auto") { foot_size = infographic_size[0] +"x"+ StandardFootHeight; }
					foot_size = SplitSizePosition(foot_size);
					foot_width = foot_size[0]; 
					foot_height = foot_size[1];
					
					var foot_position = foot.position;
					if(foot_position == undefined || foot_position == "auto") { var foot_x = 0; var foot_y = infographic_size[1] - foot_height;}
					else {
						foot_position = SplitSizePosition(foot_position);
						foot_x = foot_position[0];
						foot_y = foot_position[1];
					}
					
					if(foot_bgimage != undefined && foot_bgpattern == undefined && foot_bgcolor == undefined) {
						var img_footbgimage = new Image();
						img_footbgimage.src = foot_bgimage;

						if(IsImageUri(img_footbgimage.src)) {
							// Load image before
							var img = await loadImage(img_footbgimage.src);

							context.drawImage(img_footbgimage, Number(foot_x), Number(foot_y), Number(foot_width), Number(foot_height));
						}
					}

					else if(foot_bgpattern != undefined && foot_bgimage == undefined && foot_bgcolor == undefined) {
						var img_footpattern = new Image();

						if(IsImageUri(foot_bgpattern) == true) { img_footpattern.src = foot_bgpattern; }
						else img_footpattern.src = '/assets/images/pattern/'+ foot_bgpattern +'.png';
						
						// Load image before
						var img = await loadImage(img_footpattern.src);

						context.fillStyle = context.createPattern(img_footpattern, 'repeat');
						context.fillRect(Number(foot_x), Number(foot_y), Number(foot_width), Number(foot_height));
						context.fill();
					}

					else if(foot_bgcolor != undefined || (foot_bgimage != undefined && foot_bgpattern != undefined)) {
						context.fillStyle = foot_bgcolor;
						context.fillRect(Number(foot_x), Number(foot_y), Number(foot_width), Number(foot_height));
						context.fill();
					}
				}
				

				// Foot section text drawing
				var footText = foot.text;
				if(foot == "off" || footText == "off") { footText = ""}
				else if(footText == undefined) footText = StandardFootTextValue;

				if(footText != "off" || isEmpty(footText) || isEmpty(foot)) {
					footText = ReplaceSpecialWords(footText);
					context.font = "12px sans-serif";
					context.fillStyle = "#000000";
					context.fillText(footText, 70, infographic_size[1] - (0.48 * foot_height), 560);
					context.fill();
				}

				// Check for box.n and draw boxes | size & position is required
				for(var i = 1; i < 1000; i++) {
					var box = get(specification, 'box' + i);
					if(isEmpty(box)) break;
					
					var boxBgImage = box.bgimage;
					var boxBgPattern = box.bgpattern;
					var boxBgColor = box.bgcolor;
					if((boxBgPattern == undefined && boxBgImage == undefined && boxBgColor == undefined) || ((boxBgImage != undefined && boxBgPattern != undefined) && boxBgColor == undefined)) { boxBgColor = StandardBoxBgColor; }
					else if (boxBgColor == "0") boxBgColor = "#000000";
					else if (IsHexCode(boxBgColor) == true) { boxBgColor = "#"+ boxBgColor; }

					var boxPosition = box.position;
					if(boxPosition == undefined) break;
					if(boxPosition == 0) boxPosition = "0x0";
					boxPosition = SplitSizePosition(boxPosition);

					var boxSize = box.size;
					if(isEmpty(boxSize)) { boxSize = StandardBoxSize; }
					boxSize = SplitSizePosition(boxSize);
					
					if(boxBgImage != undefined && boxBgPattern == undefined && foot_bgcolor == undefined) {
						var img_boxbgimage = new Image();
						img_boxbgimage.src = boxBgImage;
						
						if(IsImageUri(img_boxbgimage.src)) {
							// Load image before
							var img = await loadImage(img_boxbgimage.src);
						}
						context.drawImage(img_boxbgimage, Number(boxPosition[0]), Number(boxPosition[1]), Number(boxSize[0]), Number(boxSize[1]));
					}

					else if(boxBgPattern != undefined && boxBgImage == undefined && foot_bgcolor == undefined) {
						var img_boxpattern = new Image();

						if(IsImageUri(boxBgPattern) == true) {  img_boxpattern.src = boxBgPattern; }
						else img_boxpattern.src = '/assets/images/pattern/'+ boxBgPattern +'.png';
						
						// Load image before
						var img = await loadImage(img_boxpattern.src);

						context.fillStyle = context.createPattern(img_boxpattern, 'repeat');
						context.fillRect(Number(boxPosition[0]), Number(boxPosition[1]), Number(boxSize[0]), Number(boxSize[1]));
						context.fill();
					}

					else if(boxBgColor != undefined || (boxBgImage != undefined && boxBgPattern != undefined)) {
						context.fillStyle = boxBgColor;
						context.fillRect(Number(boxPosition[0]), Number(boxPosition[1]), Number(boxSize[0]), Number(boxSize[1]));
						context.fill();
					}
				}

				// Check for Imagen and draw || position & size & src required
				for(var i = 1; i< 1000; i++) {
					var images = get(specification, 'image' + i);
					if(isEmpty(images)) break;

					var imageSize = images.size;
					if(isEmpty(imageSize)) break;
					imageSize = SplitSizePosition(imageSize);

					var imagePosition = images.position;
					if(isEmpty(imagePosition)) break;
					imagePosition = SplitSizePosition(imagePosition);

					var imageSrc = images.src;
					if(isEmpty(imageSrc)) break;

					if(IsImageUri(imageSrc)) {
						var imageDrawing = new Image();
						imageDrawing.src = images.src;
						
						// Load image before
						var img = await loadImage(images.src);
						
						context.drawImage(imageDrawing, imagePosition[0], imagePosition[1], imageSize[0], imageSize[1]);
						context.fill();
					}
				}

				// Check for Textn and draw | Position is required
				for(var i = 1; i < 1000; i++) {
					var text = get(specification, 'text' + i);
					if(isEmpty(text)) break;

					var textColor = text.color;
					if(textColor == undefined || textColor == "0" || textColor == "auto") { textColor = StandardTextColor;}
					else if (textColor == "0") textColor = "#000000";
					else if (IsHexCode(textColor) == true) { textColor = "#"+ textColor; }

					var textFont = text.font;
					if(textFont == undefined || textFont == "auto") { textFont = StandardTextFont;}

					var textValue = text.value;
					if(textValue == undefined || textValue == "auto") { textValue = StandardTextValue;}

					var textLineHeight = text.lineheight;
					if(textLineHeight == undefined || textLineHeight == "auto") { textLineHeight = StandardTextLineHeight;}
					
					var textMaxWidth = text.maxwidth;
					if(textMaxWidth == undefined || textMaxWidth == "auto") { textMaxWidth = StandardTextMaxWidth;}
			
					var textPosition = text.position;
					if(textPosition == undefined) break;
					textPosition = SplitSizePosition(textPosition);

					var textAlign = text.align;
					if(textAlign == "center" || textAlign == "left" || textAlign == "right") context.textAlign = textAlign;
					else context.textAlign = "start";
					
					wrapText(textValue, Number(textPosition[0]), Number(textPosition[1]), Number(textMaxWidth), textFont, textColor, Number(textLineHeight));
					context.textAlign = "start";
				}

				// Check for TitleTextn and draw | Position is required
				for(var i = 1; i < 1000; i++) {
					var titleText = get(specification, 'titletext' + i);
					if(isEmpty(titleText)) break;

					var titleTextColor = titleText.color;
					if(isEmpty(titleTextColor)) { titleTextColor = StandardTitleTextColor;}
					else if (titleTextColor == "0") titleTextColor = "#000000";
					else if (IsHexCode(titleTextColor) == true) { titleTextColor = "#"+ titleTextColor; }

					var titleTextFont = titleText.font;
					if (isEmpty(titleTextFont)) { titleTextFont = StandardTitleTextFont;}

					var titleTextValue = (titleText.value).toString();
					if(isEmpty(titleTextValue)) { titleTextValue = StandardTitleTextValue;}

					var titleTextLineHeight = titleText.lineheight;
					if(titleTextLineHeight == undefined) { titleTextLineHeight = StandardTitleTextLineHeight;}
					
					var titleTextMaxWidth = titleText.maxwidth;
					if(titleTextMaxWidth == undefined) { titleTextMaxWidth = StandardTitleTextMaxWidth;}
			
					var titleTextPosition = titleText.position;
					if(titleTextPosition == undefined) break;
					titleTextPosition = SplitSizePosition(titleTextPosition);

					var titleTextAlign = titleText.align;
					if(titleTextAlign == "center" || titleTextAlign == "left" || titleTextAlign == "right") { context.textAlign = titleTextAlign;}
					else context.textAlign = "start";

					//Right now titles can't <br />
					context.fillStyle = titleTextColor;
					context.font = titleTextFont;
					context.fillText(titleTextValue, titleTextPosition[0], titleTextPosition[1], titleTextMaxWidth);
					
					// Wrap text if wanted maybe with wrap: true option (not added yet)
					// wrapText(titleTextValue, Number(titleText_x), Number(titleText_y), Number(titleTextMaxWidth), titleTextFont, titleTextColor, Number(titleTextLineHeight));
					context.textAlign = "start";
				}
				
				// Check for Barchartn and draw || Position & data required
				for(var i = 1; i < 1000; i++) {
					var barcharts = get(specification, 'barchart' + i);
					if(isEmpty(barcharts)) break;

					var barChartBgColor = barcharts.bgcolor;
					if(isEmpty(barChartBgColor)) { barChartBgColor = StandardBarChartBgColor;}
					else if (barChartBgColor == "0") barChartBgColor = "#000000"
					else if (IsHexCode(barChartBgColor) == true) { barChartBgColor = "#"+ barChartBgColor; }

					var barChartGridScale = barcharts.gridscale;
					if(barChartGridScale == undefined) { barChartGridScale = StandardBarChartGridScale;}

					var barChartPadding = barcharts.padding;
					if(barChartPadding == undefined) { barChartPadding = StandardBarChartPadding;}

					var barChartTitle = barcharts.title;
					if(isEmpty(barChartTitle)) { barChartTitle = StandardBarChartTitle;}

					var barChartSize = barcharts.size;
					if(isEmpty(barChartSize)) { barChartSize = StandardBarChartSize;}
					barChartSize = SplitSizePosition(barChartSize);

					var barChartPosition = barcharts.position;
					if(barChartPosition == undefined) break;
					barChartPosition = SplitSizePosition(barChartPosition);

					var barChartDataInput = barcharts.data;
					if(barChartDataInput == undefined) break;
					var barChartData = calculateChartData(barChartDataInput)

					var barChartShowLegend = barcharts.showlegend;
					if(barChartShowLegend == undefined) { barChartShowLegend = StandardBarChartShowLegend;}
					else if (barChartShowLegend == "off") barChartShowLegend = "n";
					else barChartShowLegend = "y"

					var barChartShowTitle = barcharts.showtitle;
					if(barChartShowTitle == undefined) { barChartShowTitle = StandardBarChartShowTitle;}
					else if (barChartShowTitle == "off") barChartShowTitle = "n";
					else barChartShowTitle = "y"

					var barChartShowGrid = barcharts.showgrid;
					if(barChartShowGrid == undefined) { barChartShowGrid = StandardBarChartShowGrid;}
					else if (barChartShowGrid == "off") barChartShowGrid = "n";
					else barChartShowGrid = "y"


					var barChartColors = barcharts.colors;
					if(barChartColors == undefined) barChartColors = standardcolor;
					else {
						var barChartColors2 = barChartColors.split(',');
						barChartColors2 = barChartColors2.map(Function.prototype.call, String.prototype.trim);

						barChartColors = [];

						for(var it=0; it<barChartColors2.length;it++) {
							barChartColors[it]="#"+barChartColors2[it];
						}
					}

					var chart_exampledata = {
						"Classical music": 10,
						"Alternative rock": 14,
						"Pop": 7,
						"Popsdffd": 7,
					};	

					new drawBarChart(Number(barChartSize[0]), Number(barChartSize[1]), Number(barChartPosition[0]), Number(barChartPosition[1]), barChartData, barChartColors, Number(barChartPadding), Number(barChartGridScale), barChartShowLegend, barChartTitle, barChartBgColor, barChartShowTitle, barChartShowGrid);
				}

				// Check for Piechartn and draw || position & data required
				for(var i=1; i < 1000; i++) {
					var piecharts = get(specification, 'piechart' + i);
					if(isEmpty(piecharts)) break;
					
					var pieChartBgColor = piecharts.bgcolor;
					if(isEmpty(pieChartBgColor)) { pieChartBgColor = StandardPieChartBgColor;}
					else if(pieChartBgColor == "0") pieChartBgColor = "#000000";
					else if (IsHexCode(pieChartBgColor) == true) { pieChartBgColor = "#"+ pieChartBgColor; }

					var pieChartColors = piecharts.colors;
					if(pieChartColors == undefined) pieChartColors = standardcolor;
					else {
						var pieChartColors2 = pieChartColors.split(',');
						pieChartColors2 = pieChartColors2.map(Function.prototype.call, String.prototype.trim);

						pieChartColors = [];

						for(var it=0; it<pieChartColors2.length;it++) {
							pieChartColors[it]="#"+pieChartColors2[it];
						}
					}

					var pieChartSize = piecharts.size;
					if(pieChartSize == undefined) { pieChartSize = StandardPieChartSize;}

					var pieChartPadding = piecharts.padding;
					if(pieChartPadding == undefined) { pieChartPadding = StandardPieChartPadding;}

					var pieChartPosition = piecharts.position;
					if(pieChartPosition == undefined) break;
					pieChartPosition = SplitSizePosition(pieChartPosition);
					
					var pieChartTitle = piecharts.title;
					if(isEmpty(pieChartTitle)) { pieChartTitle = StandardPieChartTitle;}
					
					var pieChartDataInput = piecharts.data;
					if(pieChartDataInput == undefined) break;
					var pieChartData = calculateChartData(pieChartDataInput);

					var pieChartShowPercentage = piecharts.showpercentage;
					if(pieChartShowPercentage == undefined) { pieChartShowPercentage = StandardPieChartShowPercentage;}
					else if (pieChartShowPercentage == "off") pieChartShowPercentage = "n";
					else pieChartShowPercentage = "y"

					var pieChartShowLegend = piecharts.showlegend;
					if(pieChartShowLegend == undefined) { pieChartShowLegend = StandardPieChartShowLegend;}
					else if (pieChartShowLegend == "off") pieChartShowLegend = "n";
					else pieChartShowLegend = "y"

					var pieChartShowTitle = piecharts.showtitle;
					if(pieChartShowTitle == undefined) { pieChartShowTitle = StandardPieChartShowTitle;}
					else if (pieChartShowTitle == "off") pieChartShowTitle = "n";
					else pieChartShowTitle = "y"

					var pieChartType = piecharts.type;
					if(pieChartType == undefined) { pieChartType = StandardPieChartType;}
					else if (pieChartType == "donut") pieChartType = "donut";

					var pieChartLegendStyle = piecharts.legendstyle;
					if(pieChartLegendStyle == undefined) { pieChartLegendStyle = 1;}

					var chart_exampledata1 = {
						"Male 2018": "100 - 2018#S38",
						"Male 2019": "100 - S38",
					};	
		
					drawPieChart(pieChartType, Number(pieChartSize), Number(pieChartPosition[0]), Number(pieChartPosition[1]), pieChartData, Number(pieChartPadding), pieChartTitle, pieChartBgColor, pieChartColors, pieChartShowLegend, pieChartLegendStyle, pieChartShowPercentage, pieChartShowTitle);
				}

				// Check for Picturegraphn and draw || position & type required
				for(var i=1; i < 1000; i++) {
					var picturegraphs = get(specification, 'picturegraph' + i);
					if(isEmpty(picturegraphs)) break;

					var pictureGraphBgColor = picturegraphs.bgcolor;
					if(isEmpty(pictureGraphBgColor)) { pictureGraphBgColor = StandardPictureGraphBgColor;}
					else if (pictureGraphBgColor == "0") pictureGraphBgColor = "#000000";
					else if (IsHexCode(pictureGraphBgColor) == true) { pictureGraphBgColor = "#"+ pictureGraphBgColor; }

					var pictureGraphSize = picturegraphs.size;
					if(pictureGraphSize == undefined) { pictureGraphSize = StandardPictureGraphSize;}
					pictureGraphSize = SplitSizePosition(pictureGraphSize);

					var pictureGraphPadding = picturegraphs.padding;
					if(pictureGraphPadding == undefined) { pictureGraphPadding = StandardPictureGraphPadding;}

					var pictureGraphPosition = picturegraphs.position;
					if(pictureGraphPosition == undefined) break;
					pictureGraphPosition = SplitSizePosition(pictureGraphPosition);

					var pictureGraphColors = picturegraphs.colors;
					if(pictureGraphColors == undefined) pictureGraphColors = standardcolor;
					else {
						var pictureGraphColors2 = pictureGraphColors.split(',');
						pictureGraphColors2 = pictureGraphColors2.map(Function.prototype.call, String.prototype.trim);

						pictureGraphColors = [];

						for(var it=0; it<pictureGraphColors2.length;it++) {
							pictureGraphColors[it]="#"+pictureGraphColors2[it];
						}
					}

					var pictureGraphTitle = picturegraphs.title;
					if(isEmpty(pictureGraphTitle)) { pictureGraphTitle = StandardPictureGraphTitle;}

					var pictureGraphShowLegend = picturegraphs.showlegend;
					if(pictureGraphShowLegend == undefined) { pictureGraphShowLegend = StandardPictureGraphShowLegend;}
					else if (pictureGraphShowLegend == "off") pictureGraphShowLegend = "n";
					else pictureGraphShowLegend = "y"

					var pictureGraphShowTitle = picturegraphs.showtitle;
					if(pictureGraphShowTitle == undefined) { pictureGraphShowTitle = StandardPictureGraphShowTitle;}
					else if (pictureGraphShowTitle == "off") pictureGraphShowTitle = "n";
					else pictureGraphShowTitle = "y"

					var pictureGraphType = picturegraphs.type;
					var pictureGraphItemLabel = picturegraphs.label;
					if(pictureGraphType == undefined) { break; }
					else if (pictureGraphType == "bin") { if(pictureGraphItemLabel == undefined) { pictureGraphItemLabel = StandardPictureGraphItemLabelBin;}}
					else if (pictureGraphType == "electric") { if(pictureGraphItemLabel == undefined) { pictureGraphItemLabel = StandardPictureGraphItemLabelElectric;}}
					else if (pictureGraphType == "circles-top") { if(pictureGraphItemLabel == undefined) { pictureGraphItemLabel = "test"; }}
					else if (pictureGraphType == "circles-bot") { if(pictureGraphItemLabel == undefined) { pictureGraphItemLabel = "test"; }}
					else { break; }

					
					var picturegraph_data_bin1 = {
						"2018": 4000,
						"2019": 1500,
					}

					var pictureGraphDataInput = picturegraphs.data;
					if(pictureGraphDataInput == undefined) break;
					var pictureGraphData = calculateChartData(pictureGraphDataInput);

					// console.log("BgColor: " + pictureGraphBgColor +" Size: "+ pictureGraphSize +" Padding: "+ pictureGraphPadding +" Position: "+ pictureGraphPosition +" Title: "+ pictureGraphTitle +" Type: "+ pictureGraphType +" Label: "+ pictureGraphItemLabel);	
					
					new drawPicturegraph(pictureGraphType, Number(pictureGraphSize[0]), Number(pictureGraphSize[1]), Number(pictureGraphPosition[0]), Number(pictureGraphPosition[1]), pictureGraphData, pictureGraphColors, Number(pictureGraphPadding), pictureGraphTitle, pictureGraphItemLabel, pictureGraphShowLegend, pictureGraphShowTitle);
					// new drawPicturegraph("Bin", 100, 100, 375, 785, picturegraph_data_bin, 10, "Total waste", "kg");
				}

				// Draw functions for diagrams (Need to go in seperate file)
				function drawPieSlice(centerX, centerY, radius, startAngle, endAngle, color){
					context.fillStyle = color;
					context.beginPath();
					context.moveTo(centerX,centerY);
					context.arc(centerX, centerY, radius, startAngle, endAngle);
					context.closePath();
					context.fill();
				}

				function drawLine(startX, startY, endX, endY,color){
					context.strokeStyle = color;
					context.beginPath();
					context.moveTo(startX,startY);
					context.lineTo(endX,endY);
					context.stroke();
					context.closePath();
					context.fill();
				}

				function drawBar(upperLeftCornerX, upperLeftCornerY, width, height,color){
					context.fillStyle = color;
					context.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
					context.fill();
				}
				
				function wrapText(text, offsetx, offsety, maxWidth, font, fontColor, lineHeight) {
					if(lineHeight == 0 || lineHeight == 'auto') {
						// Auto
						lineHeight = Number(font.replace(/\D/g,'')) + 10;
					}
					var words = text.split(' ');
					var line = '';
					context.font = font;
					context.fillStyle = fontColor;
			
					for(var n = 0; n < words.length; n++) {
					var testLine = line + words[n] + ' ';
					var metrics = context.measureText(testLine);
					var testWidth = metrics.width;
					if (testWidth > maxWidth && n > 0) {
						context.fillText(line, offsetx, offsety);
						line = words[n] + ' ';
						offsety += lineHeight;
					}
					else {
						line = testLine;
					}
					}
					context.fillText(line, offsetx, offsety);
					context.fill();
				}

				//Pie Chart draw function
				function drawPieChart(type, radius, offsetx, offsety, piechartdata, padding, chartTitle, chartBgColor, itemColor, showLegend, legendStyle, showPercentage, showTitle){
					var numberOfItems = Object.keys(piechartdata).length;

					//draw background of bar chart and draw title
					var piechartHeight = radius*2+padding + 30 + Math.ceil(numberOfItems/2) * 20;
					if(legendStyle == "2") piechartHeight = radius*2+padding + 30 + numberOfItems * 20;
					if(showLegend == "n") piechartHeight = radius*2+padding + 30;
					if(showTitle == "n") piechartHeight = piechartHeight - 20;
					drawBar(offsetx, offsety, radius*2+padding*2, piechartHeight, chartBgColor);
			
					if(showTitle == "y") {
						context.font = "bold 14px sans-serif";
						context.fillStyle = "#000000";
						context.textAlign = "center";
						context.fillText(chartTitle, offsetx + radius*2/1.8, offsety+radius*2+padding + 20, radius*2+padding*2);
						context.fill();
					}

					// Reset textalign
					context.textAlign = "left";

					var totalval = 0;
					var start_angle = 0;
					var piecolor = 0;

					for(var pieElement in piechartdata){
						var val = piechartdata[pieElement];
						totalval += val;
					}

					for(pieElement in piechartdata) {
						val = piechartdata[pieElement];
						var slice_angle = 2 * Math.PI * val / totalval;

						drawPieSlice(radius+offsetx+padding,radius+offsety+padding,radius, start_angle, start_angle+slice_angle, itemColor[piecolor]);

						if(showPercentage == "y") {
							if(type == "donut") {
								var labelX = radius+offsetx + (radius / 1.4) * Math.cos(start_angle + slice_angle/2);
								var labelY = radius+offsety + (radius / 1.4) * Math.sin(start_angle + slice_angle/2) + 15;
							}

							else {
								var labelX = radius+offsetx + (radius / 2) * Math.cos(start_angle + slice_angle/2);
								var labelY = radius+offsety + (radius / 2) * Math.sin(start_angle + slice_angle/2) + 15;
							}

							var labelText = Math.round(100 * val / totalval);
							context.fillStyle = "#ffffff";
							context.font = "bold 15px Arial";
							context.fillText(labelText+"%", labelX,labelY);
						}

						start_angle += slice_angle;
						piecolor += 1;
					}

					// Reset piecolor for drawing legends
					if(showLegend == "y") {
						var piecolor = 0;
						piecolor += 1;

						if(legendStyle == "2") {
							for (var pieElement in piechartdata) {
	
									context.font = "12px sans-serif";
									context.beginPath();
									context.fillStyle = "#000000";
									context.fillText(pieElement +": " + piechartdata[pieElement], offsetx + padding + 10, offsety+radius*2+padding+40+(piecolor-1)*20, radius/1.2);
									context.fill();
									
									piecolor -= 1;
									context.fillStyle = itemColor[piecolor];
									context.fillRect(offsetx + 5, offsety+radius*2+padding+(piecolor *20) + 30, 10, 10);
									context.fill();
	
									piecolor += 2;
								}
							}

						else {	
							for (var pieElement in piechartdata) {
								var verticalindex = Math.floor(piecolor / 2);
	
								if(piecolor % 2 == 1){
									context.font = "12px sans-serif";
									context.beginPath();
									context.fillStyle = "#000000";
									context.fillText(pieElement +": " + piechartdata[pieElement], offsetx + padding + 10, offsety+radius*2+padding+40+verticalindex*20, radius/1.2);
									context.fill();
									
									piecolor -= 1;
									context.fillStyle = itemColor[piecolor];
									context.fillRect(offsetx + 5, offsety+radius*2+padding+(verticalindex *20) + 30, 10, 10);
									context.fill();
	
									piecolor += 2;
								}
									else {
									context.font = "12px sans-serif";
									context.fillStyle = "#000000";
									context.fillText(pieElement +": " + piechartdata[pieElement], offsetx + radius*1.1 + padding + 15, offsety+radius*2+padding+(verticalindex * 20) + 20, radius/1.3);
									context.fill();
	
									piecolor -= 1;
									context.fillStyle = itemColor[piecolor];
									context.fillRect(offsetx + radius*1.1 + padding, offsety+radius*2+padding+(verticalindex *20) +10 , 10, 10);
									context.fill();
									
									piecolor += 2;
								}
							}
						}
					}
					if(type == "donut") {
						drawPieSlice(radius+offsetx+padding,radius+offsety+padding,radius/2, 0, radius * Math.PI * 2, "#ffffff");
					}
					
					context.beginPath();
				}

				// Bar Chart draw function
				function drawBarChart(width, height, offsetx, offsety, barchartdata, itemColor, padding, gridScale, showLegend, chartTitle, chartBgColor, showTitle, showGrid){
					var maxval = 0;
					var numberOfBars = Object.keys(barchartdata).length;

					//draw background of bar chart and draw title
					var barChartHeight = height+padding + 20 + Math.ceil(numberOfBars/2) * 20;
					if(showLegend == "n") barChartHeight = height+padding + 20;
					if(showTitle == "n") barChartHeight = barChartHeight - 20;

					context.fillStyle = chartBgColor;
					context.fillRect(offsetx, offsety, width+padding*2, barChartHeight);
					context.fill();

					if(showTitle == "y") {
						context.font = "bold 14px sans-serif";
						context.fillStyle = "#000000";
						context.textAlign = "center";
						context.fillText(chartTitle, offsetx + width/1.8, offsety+height+padding + 10, width+padding*2);
						context.fill();
					}

					// Reset textalign
					context.textAlign = "left";
					
					for(var barElement in barchartdata){
						maxval = Math.max(maxval, barchartdata[barElement]);
					}

					var canvasActualHeight = height - padding * 2;
					var canvasActualWidth = width - padding * 2;
			
					//drawing the grid lines
					if(showGrid== "y") {
						var gridValue = 0;
						while (gridValue <= maxval){
							var gridY = canvasActualHeight * (1 - gridValue/maxval) + padding;
							drawLine(offsetx + padding, offsety + gridY + padding, width + offsetx + padding, offsety + gridY + padding, "#000000");
							
							//writing grid markers
							context.save();
							context.fillStyle = "#000000";
							context.font = "bold 10px Arial";
							context.fillText(gridValue.toString(), offsetx + padding + 8, offsety + gridY + padding - 2);
							context.restore();
				
							gridValue+=gridScale;
						}
					}

					//drawing the bars
					var barIndex = 0;
					var barSize = (canvasActualWidth)/numberOfBars - 4;
						
						
					for (var barelement in barchartdata){
						var val = barchartdata[barelement];
						var barHeight = Math.round(canvasActualHeight * val/maxval);
						drawBar(offsetx + 15 + padding*2 + barIndex * barSize, offsety + height - barHeight -1, barSize, barHeight, itemColor[barIndex]);
								
						barIndex++;
					}

					// Reset barIndex for drawing legends
					if(showLegend == "y") {
						var barIndex = 0;
						
						barIndex += 1;

						for (var barelement in barchartdata) {
							var verticalindex = Math.floor(barIndex / 2);
							if(barIndex % 2 == 1){
								context.font = "12px sans-serif";
								context.fillStyle = "#000000";
								context.fillText(barelement +": " + barchartdata[barelement], offsetx + padding + 15, offsety+height+padding+30+verticalindex*20, width/2.5);
								context.fill();

								barIndex -= 1;
								context.fillStyle = itemColor[barIndex];
								context.fillRect(offsetx + 5, offsety+height+padding+(verticalindex *20) + 20, 10, 10);
								context.fill();

								barIndex += 2;
							}

							else {
								context.font = "12px sans-serif";
								context.fillStyle = "#000000";
								context.fillText(barelement +": " + barchartdata[barelement], offsetx + width/2.5 + padding + 50, offsety+height+padding+(verticalindex * 20) + 10, width/2.5);
								context.fill();

								barIndex -= 1;
								context.fillStyle = itemColor[barIndex];
								context.fillRect(offsetx + width /2.5 + padding + 30, offsety+height+padding+(verticalindex *20) , 10, 10);
								context.fill();

								barIndex += 2;
							}
						}
					}
				}

				// Picturegraph draw function
				function drawPicturegraph(type, width, height, offsetx, offsety, picturegraphdata, itemColors, padding, picturegraphTitle, picturegraphItemLabel, showLegend, showTitle) {
					// picturegraphdata.sort() om data te sorteren wellicht
					if(type == "electric") {
						context.fillStyle = "#ffffff";
						if(showLegend != "n" || showTitle !="n") var picturegraphwidth = width + 2*padding + 135;
						else var picturegraphwidth = width + 2*padding;

						context.fillRect(offsetx-padding, offsety-padding, picturegraphwidth, height+2*padding);
						context.fill();

						var piccolor = 0;
						var maxval = 0;

						for(var picturegraph_item in picturegraphdata) {					
							maxval = Math.max(maxval, picturegraphdata[picturegraph_item]);
						}

						for(var picturegraph_item in picturegraphdata) {
							var item_height = picturegraphdata[picturegraph_item] / maxval;
							
							context.fillStyle = itemColors[piccolor];
							context.fillRect(offsetx, offsety + height - (item_height*height), width, item_height * height);
							context.fill();

							piccolor += 1;
						}
						
						var img_picturegraph = new Image();
						img_picturegraph.src = '/assets/images/picturegraph-electricity.png';
						img_picturegraph.onload = function() {
							context.drawImage(img_picturegraph, offsetx, offsety, width, height);
						}

						// Reset piccolor for drawing legends
						if(showLegend== "y") {
							var piccolor = 0;
							if(showTitle== "y") {
								context.font = "bold 12px sans-serif";
								context.fillStyle = "#000000";
								context.fillText(picturegraphTitle, offsetx + width + padding, offsety+padding+(piccolor * 20) + 15, 200);
							}
							piccolor += 1;

							for (var picturegraph_item in picturegraphdata) {
									context.font = "12px sans-serif";
									context.fillStyle = "#000000";
									context.fillText(picturegraph_item +": " + picturegraphdata[picturegraph_item] +" "+ picturegraphItemLabel, offsetx + width + padding + 20, offsety+padding+(piccolor * 20) + 15, 200);
									context.fill();

									piccolor -= 1;
									context.fillStyle = itemColors[piccolor];
									context.fillRect(offsetx + width + padding, offsety+padding+(piccolor *20) + 25, 10, 10);
									piccolor += 2;
							}
						}
					}
					
					if(type == "bin") {
						context.fillStyle = "#ffffff";
						if(showLegend != "n" || showTitle !="n") var picturegraphwidth = width + 2*padding + 135;
						else var picturegraphwidth = width + 2*padding;

						context.fillRect(offsetx-padding, offsety-padding, picturegraphwidth, height+2*padding);
						context.fill();

						var piccolor = 0;
						var maxval = 0;

						for(var picturegraph_item in picturegraphdata) {					
							maxval = Math.max(maxval, picturegraphdata[picturegraph_item]);
						}

						for(var picturegraph_item in picturegraphdata) {
							var item_height = picturegraphdata[picturegraph_item] / maxval;
							
							context.fillStyle = itemColors[piccolor];
							context.fillRect(offsetx, offsety + height - (item_height*height), width, item_height * height);
							context.fill();

							piccolor += 1;
						}

						var img_picturegraph = new Image();
						img_picturegraph.src = '/assets/images/picturegraph-bin.png';
						img_picturegraph.onload = function() {
							context.drawImage(img_picturegraph, offsetx, offsety, width, height);
						}

						// Reset piccolor for legends
						if(showLegend== "y") {
							var piccolor = 0;
							if(showTitle== "y") {
								context.font = "bold 12px sans-serif";
								context.fillStyle = "#000000";
								context.fillText(picturegraphTitle, offsetx + width + padding, offsety+padding+(piccolor * 20) + 15, 200);
							}
							piccolor += 1;

							for (var picturegraph_item in picturegraphdata) {
								context.font = "12px sans-serif";
								context.fillStyle = "#000000";
								context.fillText(picturegraph_item +": " + picturegraphdata[picturegraph_item] +" "+ picturegraphItemLabel, offsetx + width + padding + 20, offsety+padding+(piccolor * 20) + 15, 200);
								context.fill();

								piccolor -= 1;
								context.fillStyle = itemColors[piccolor];
								context.fillRect(offsetx + width + padding, offsety+padding+(piccolor *20) + 25, 10, 10);

								piccolor += 2;
							}
						}
					}

					if(type == "circles-top" || type == "circles-bot") {
						width = width/2;
						height = height/2;

						context.fillStyle = pictureGraphBgColor;
						var picturegraphbgwidth = width*2 + padding*2;
						if(showLegend == "y") { picturegraphbgwidth += 60; }
						context.fillRect(offsetx, offsety, picturegraphbgwidth, height*2 + padding*2);
						context.fill();	
						
						var maxval = 0;
						var piccolor = 0;
						
						for(var picturegraph_item in picturegraphdata) {					
							maxval = Math.max(maxval, picturegraphdata[picturegraph_item]);
						}

						for(var picturegraph_item in picturegraphdata) {
							var item_height = picturegraphdata[picturegraph_item] / maxval;
							
							if(showLegend == "y" && type == "circles-bot") {
								context.beginPath();
								context.fillStyle = "#9ec7cb";
								context.fillRect(offsetx + width + padding, offsety + 2*height - height*item_height + padding, 150, 1);
								context.fill();
								context.closePath();

								context.fillStyle = "#03504a";
								context.fillText(picturegraph_item, offsetx + width + padding + 125, offsety + 2*height - height*item_height + padding - 2);
								context.fill();
							}
							
							if(showLegend == "y" && type == "circles-top") {
								context.beginPath();
								context.fillStyle = "#9ec7cb";
								context.fillRect(offsetx + width + padding, offsety + height*item_height + padding, 150, 1);
								context.fill();
								context.closePath();

								context.fillStyle = "#03504a";
								context.fillText(picturegraph_item, offsetx + width + padding + 125, offsety + height*item_height + padding - 2);
								context.fill();
							}

							context.beginPath();
							context.fillStyle = itemColors[piccolor];
							if(type == "circles-top") context.arc(offsetx + width + padding, offsety + height*item_height + padding, width*item_height, 0, Math.PI *2);
							if(type == "circles-bot") context.arc(offsetx + width + padding, offsety + 2*height - height*item_height + padding, width*item_height, 0, Math.PI *2);
							context.fill();

							// console.log(item_height +" "+ height*item_height +" "+ itemColors[piccolor]);

							piccolor += 1;
							context.closePath();
						}
					}
				}

				/*
				var picturegraph_data_bin = {
					"2018": 4000,
					"2019": 1500,
				}

				var picturegraph_data_electric = {
					"2018": 2300,
					"2019": 2000,
					"2020": 1710,
				};

				new drawPicturegraph("electric", 100, 100, 85, 785, picturegraph_data_electric, 10, "Power consumption", "kWh");
				new drawPicturegraph("Bin", 100, 100, 375, 785, picturegraph_data_bin, 10, "Total waste", "kg");
				var myBarchart = new drawBarChart(250, 170, 70, 475, chart_data, 10, 2, "Try out bar chart", "#ffffff");
				var myPiechart = new drawPieChart(100, 70, 170, piechart_data, 10, "Female/male employees","#ffffff");
				*/
			}
		}

		/*
		function download (type) {
			var canvas1 = document.getElementById('canvas') as HTMLCanvasElement;
			var myImage = canvas1.toDataURL("image/jpg");
			// window.document.write('<iframe src="', myimage ,'" style="border:0; top: 0px; left: 0px; width:100%; height:100%;" allowfullscreen frameborder="0"></iframe>');	
			// window.document.location.href = myimage;
			var button = document.getElementById('downloadjpg');
			
		}
		*/

		return (
			<React.Fragment>
				{PageHead}
				<Container>
					<Section maxWidth={infographic_size[0]}>
						<Button onClick={ initializeCanvas } appearance="default" >Render</Button>
						<h3>Infographic</h3>
						<canvas width={infographic_size[0]} height={infographic_size[1]}  id="canvas" style={{border: '1px solid #c0c0c0', marginTop: '10px', marginBottom: '10px' }}>
							This text is displayed if your browser does not support HTML5 Canvas.
						</canvas>

						<h3>Specifications</h3>
						<pre>{JSON.stringify(infographic.specification, null, 2)}</pre>
				
					</Section>
				</Container>
			</React.Fragment>
		); 
	}
}

export default withRouter(OrganisationInfographicOverview);
