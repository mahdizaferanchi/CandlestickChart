import React, {useState, useEffect, useRef} from 'react';
import Highcharts from 'highcharts/highstock';
// Load the exporting module.
import Exporting from 'highcharts/modules/exporting';
// Initialize exporting module. (CommonJS only)
Exporting(Highcharts);

function GeneralChart(props) {
	const chartEl = useRef(null)
	let step = (props.type === "stepLine" ? true : false)
	const validate = (data) => {
		if (!data.flat().every((el) => typeof(el) === 'number')) {
			return false
		}
		return true
	}
	if (!validate(props.data)) {
		console.log('Invalid data')
	}
	const getTrueType = (passedType) => {
		if (passedType === 'stepLine')
			return 'line'
		return passedType
	}
	useEffect(() => {
		Highcharts.stockChart(chartEl.current, {
			title: {
	        	text: props.name,
	        },
			series: [{
		        type: getTrueType(props.type),
		        step: step,
		        lineWidth: 0,
		        marker: {
		        	enabled: true,
		        	radius: 4,
		        },
		        states: {
		        	hover: {
		        		lineWidthPlus: 0
		        	}
		        },
		        name: props.name,
		        data: props.data,
		        dataGrouping: {
			        units: [
			        	['minute',[10]],
			        	['hour', [1]],
			        	['week',[1]], 
			        	['month', [1, 2, 3, 4, 6]]
			        ]
		        },
	        }],
		})
	})
	return(
		<div>
			<div ref={chartEl} style={{'height': '700px', 'minWidth': "310px"}}></div>
		</div>
		);
}

export default GeneralChart;