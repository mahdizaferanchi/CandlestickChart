import React, {useState, useEffect, useRef} from 'react';
import Highcharts from 'highcharts/highstock';
import HC_more from 'highcharts/highcharts-more';
HC_more(Highcharts);

// props.type should be one of these:
//'line', 'point', 'stepline', 'spline', 'area', 'areaspline', 'column', 'arearange',
// 'areasplinerange', 'columnrange', 'candlestick', 'ohlc'
function GeneralChart(props) {
	const chartEl = useRef(null)
	const timeInterval = (props.data.length !== 0) ? props.data[1][0] - props.data[0][0] : 0
	let step = false
	let lineWidth = 2
    let marker = {
    	enabled: false,
    	radius: 4,
    }
    let states = {
    	hover: {
    		lineWidthPlus: 1
    	}
    }
	const validate = (data) => {
		if (!data.flat().every((el) => typeof(el) === 'number')) {
			return false
		}
		let singleNumCharts = ['line', 'point', 'stepline', 'spline', 'area', 'areaspline', 'column']
		let doubleNumCharts = ['arearange', 'areasplinerange', 'columnrange']
		let quadrupleNumCharts = ['candlestick', 'ohlc']
		if (singleNumCharts.includes(props.type)) {
			return data.every((el) => el.length === 2)
		}
		if (doubleNumCharts.includes(props.type)) {
			return data.every((el) => el.length === 3)
		}
		if (quadrupleNumCharts.includes(props.type)) {
			return data.every((el) => el.length === 5)
		}
		return false
	}
	if (!validate(props.data)) {
		console.log('Invalid data or chart type')
	}
	const getTrueType = (passedType) => {
		if (passedType === 'stepline') {
			step = true
			return 'line'
		}
		if (passedType === 'point') {
			lineWidth = 0
	        marker = {
	        	enabled: true,
	        	radius: 4,
	        }
	        states = {
	        	hover: {
	        		lineWidthPlus: 0
	        	}
	        }
			return 'line'
		}
		return passedType
	}
	const getRangeSelected = () => {
		let dayInterval = timeInterval >= 24 * 60 * 60 * 1000
		let hourInterval = timeInterval >= 60 * 60 * 1000
		let minuteInterval = timeInterval >= 60 * 1000
		let smallChart =  chartEl.current.offsetWidth <= 700
		let tinyChart =  chartEl.current.offsetWidth <= 400
		if (dayInterval && tinyChart) {return 4 }
		if (dayInterval) { return 5 }
		if (hourInterval && smallChart) { return 2 }
		if (hourInterval) { return 3 }
		if (minuteInterval && smallChart) { return 0 }
		if (minuteInterval) { return 1 }
	}
	useEffect(() => {
		Highcharts.stockChart(chartEl.current, {
			title: {
	        	text: props.name,
	        },
	        plotOptions: {
		        candlestick: {
		        	opacity: '0.85',
		        	color: 'red',
		            lineColor: 'red',
		            upLineColor: 'green', // docs
		            upColor: 'green'
		        }
		    },
	        rangeSelector: {
	        	buttons: [
        			{ type: 'minute', count: 30, text: '30′', title: 'View 30 minutes'},
        			{ type: 'hour', count: 1, text: '1h', title: 'View 1 hour'},
        	 		{ type: 'hour', count: 12, text: '12h', title: 'View 12 hours'}, 
        	 		{ type: 'day', count: 1, text: '1d', title: 'View 1 day'}, 
        	 		{ type: 'month', count: 1, text: '1m', title: 'View 1 month'}, 
        	 		{ type: 'month', count: 3, text: '3m', title: 'View 3 months'}, 
        	 		{ type: 'month', count: 6, text: '6m', title: 'View 6 months'}, 
        	 		{ type: 'ytd', text: 'YTD', title: 'View year to date'}, 
        	 		{ type: 'year', count: 1, text: '1y', title: 'View 1 year'}, 
        	 		{ type: 'all', text: 'All', title: 'View all'}
	        	],
	        	selected: getRangeSelected(),
	        },
			series: [{
		        type: getTrueType(props.type),
		        name: props.name,
		        data: props.data,
		        step: step,
		        lineWidth: lineWidth,
		        marker: marker,
		        states: states,
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