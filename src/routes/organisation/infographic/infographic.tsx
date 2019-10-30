import { get, isEmpty, map } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import MdEdit from 'react-icons/lib/md/edit';
import MdMoreHoriz from 'react-icons/lib/md/more-horiz';
import { Redirect, withRouter } from 'react-router-dom';
import { Button, LinkButton } from '../../../components/Button';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { Menu, MenuOption } from '../../../components/Menu';
import { Section } from '../../../components/Section';
import collection from '../../../stores/collection';
import * as fabric from 'fabric';
import { getYear } from 'date-fns';



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
					<MenuOption>Download</MenuOption>
				</Menu>}
			</Header>
		);

		
		if (isEmpty(specification)) return <Redirect to={`/${orgId}/infographics/${infographicId}/specification`} />;
		
		var infographic_size = specification.bgsize.split('x');
		
		var infographic_bgcolor = '#' + specification.bgcolor;

		var headsection = get(specification, 'head');
		if(isEmpty(headsection)) return <Redirect to={`/${orgId}/infographics/${infographicId}/specification#headsectionmissinginspecification`} />;
		
		// Headsection Title text
		if(!isEmpty(headsection.title)) { 
			var titletext = headsection.title;
			var titletext = titletext.replace('+organisation+', orgId.charAt(0).toUpperCase() + orgId.slice(1));
			var titletext = titletext.replace('+report+', infographic.report.substring(infographic.report.indexOf('/')+1));

			
			var titletext2 = orgId.charAt(0).toUpperCase() + orgId.slice(1) + ' Sustainability Highlights ' + infographic.report.substring(infographic.report.indexOf('/')+1);
		}
		else { var titletext:any = "Example title infographic"; }

		// Headsection Subtitle text
		if(!isEmpty(headsection.subtitle)) { var subtitletext:any = headsection.subtitle;}
		else { var subtitletext:any = "Example subtitle infographic";}

		var footsection = get(specification, 'foot');
		if(isEmpty(footsection)){
			var footsection_width = infographic_size[0];
			var footsection_height:any = "100";
			var footsection_bgcolor = "#b3d5f7";
		}

		else {
			var footsection_size = footsection.bgsize.split('x');
			var footsection_width = footsection_size[0];
			var footsection_height = footsection_size[1];
			var footsection_bgcolor = '#' + footsection.bgcolor;
		}
		
		var headsection_size = headsection.bgsize.split('x'); 
		var headsection_bgcolor = '#' + headsection.bgcolor;
		
				
		function load() {
			var canvas = document.getElementById('canvas') as HTMLCanvasElement;
			var context = canvas.getContext('2d');

			context.beginPath();

			// Background
			var img_pattern = new Image();
			img_pattern.src = '/assets/images/pattern/pattern2.png',
			
			context.fillStyle = infographic_bgcolor;
			//context.fillStyle = context.createPattern(img_pattern, 'repeat');

			context.fillRect(0, 0, infographic_size[0], infographic_size[1]);
			context.fill();

			// Head section
			context.fillStyle = headsection_bgcolor;
			context.fillRect(0, 0, headsection_size[0], headsection_size[1]);
			context.fill();
			
			// Title & Subtitle text

			context.font = "bold 22px sans-serif";
			context.fillStyle = "#000000";
			context.fillText(titletext, 70, 70, 560);
			context.fill();

			context.font = "18px sans-serif";
			context.fillStyle = "#000000";
			context.fillText(subtitletext, 70, 100, 560);
			context.fill();
			
			//  Logo
			var img_logo = new Image();
			img_logo.src = organisation.avatar;
			context.drawImage(img_logo, 535, 48, 100, 60);

			// Box1
			context.fillStyle = '#eae1e1';
			context.fillRect(70, 190, 560, 210);
			context.fill();

			// Box2
			context.fillStyle = '#eae1e1';
			context.fillRect(70, 440, 560, 210);
			context.fill();

			// Foot section
			context.fillStyle = footsection_bgcolor;
			context.fillRect(0, infographic_size[1] - footsection_height, footsection_width, footsection_height);
			context.fill();
			
			var footertext = 'Copyright ' + orgId.charAt(0).toUpperCase() + orgId.slice(1) +' '+ getYear(new Date()) +' - Data is based on report ' + infographic.report.substring(infographic.report.indexOf('/')+1);
			context.font = "12px sans-serif";
			context.fillStyle = "#000000";
			context.fillText(footertext, 70, infographic_size[1] - (0.48 * footsection_height), 560);
			context.fill();

			// Draw functions for diagrams
			var standardcolor = ["#fde23e","#f16e23", "#666666","#937e88","#134e88", "#11a9aa","#356e88"];
			function drawPieSlice(centerX, centerY, radius, startAngle, endAngle, color ){
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
			}

			function drawBar(upperLeftCornerX, upperLeftCornerY, width, height,color){
				context.fillStyle=color;
				context.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
				context.fill();
			}

			//Pie Chart
			function drawPieChart(radius, offsetx, offsety, piechartdata){
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

					drawPieSlice(radius+offsetx,radius+offsety,radius, start_angle, start_angle+slice_angle, standardcolor[piecolor]);

					var labelX = radius+offsetx + (radius / 2) * Math.cos(start_angle + slice_angle/2) - 15;
					var labelY = radius+offsety + (radius / 2) * Math.sin(start_angle + slice_angle/2) + 5;
					
					var labelText = Math.round(100 * val / totalval);
					context.fillStyle = "white";
					context.font = "bold 15px Arial";
					context.fillText(labelText+"%", labelX,labelY);

					start_angle += slice_angle;
					piecolor += 1;
				}

			}

			// Bar Chart
			function drawBarChart(width, height, offsetx, offsety, barchartdata, padding, gridScale){
				var maxval = 0;

				//draw background of bar chart
				drawBar(offsetx, offsety, width+padding*2, height+padding, "#ffffff");
				
				for(var barElement in barchartdata){
					maxval = Math.max(maxval, barchartdata[barElement]);
				}

				var canvasActualHeight = height - padding * 2;
				var canvasActualWidth = width - padding * 2;
		 
				//drawing the grid lines
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

				//drawing the bars
				var barIndex = 0;
				var numberOfBars = Object.keys(barchartdata).length;
				var barSize = (canvasActualWidth)/numberOfBars - 4;
					
					
				for (var barelement in barchartdata){
					var val = barchartdata[barelement];
					var barHeight = Math.round(canvasActualHeight * val/maxval);
					drawBar(offsetx + 15 + padding*2 + barIndex * barSize, offsety + height - barHeight -1, barSize, barHeight, standardcolor[barIndex]);
							 
					barIndex++;
				}
			}

			var chart_data = {
				"Classical music": 10,
				"Alternative rock": 14,
				"Pop": 7,
				"Jazz": 12,
			};

			var myBarchart = new drawBarChart(250, 170, 100, 460, chart_data, 10, 2);
			
			var myPiechart = new drawPieChart(80, 100, 215, chart_data);

			
		}
			
		
		
		return (
			<React.Fragment>
				{PageHead}
				<Container>
					<Section maxWidth={700}>
						<Button onClick={ load } appearance="default" >Hoi</Button>
						<h3>Infographic</h3>
						<canvas width={infographic_size[0]} height={infographic_size[1]} id="canvas" style={{border: '1px solid #c0c0c0', marginTop: '10px', marginBottom: '10px' }}>
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
