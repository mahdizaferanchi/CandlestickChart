import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import Highcharts from 'highcharts/highstock';
// Load the exporting module.
import Exporting from 'highcharts/modules/exporting';
// Initialize exporting module. (CommonJS only)
Exporting(Highcharts);

function CandlestickChart(props) {
	const [data, setData] = useState([])
	const chart = useRef(null)
	const chartEl = useRef(null)
	const timeInterval = useRef(0)
	useEffect(() => {
		//initial data load and interval setup
		if (data.length == 0)
		axios.get('https://demo-live-data.highcharts.com/aapl-ohlc.json')
		    .then(function (response) {
		    	// let alteredData = response.data.map((point, idx, arr) => [arr[0][0] + 60 * 1000 * (idx + 1)].concat(point.slice(1)))
		    	let alteredData = response.data
	    		setData(alteredData)
	    		timeInterval.current = alteredData[1][0] - alteredData[0][0]
	  		})
		    .catch(function (error) {
			    console.log(error);
		    })
	    const interval = setInterval(() => {
	    	//interval to update chart periodically
		    chart.current.showLoading()
		    axios.get('https://demo-live-data.highcharts.com/aapl-ohlc.json')
				.then((response) => {
					//put new data after old data
					let newData = response.data.slice(response.data.length - 3, response.data.length - 2)
				    let lastTime = data[data.length - 1][0]
				    newData = newData.map((el, idx) => [lastTime + timeInterval.current * (idx + 1)].concat(el.slice(1)))
				    setData(data.concat(newData))
				})
				.catch((error) => {
					console.log(error)
				})
		  }, 5 * 1000);
		  return () => clearInterval(interval);
	});
	const getRangeSelected = () => {
		let dayInterval = timeInterval.current >= 24 * 60 * 60 * 1000
		let hourInterval = timeInterval.current >= 60 * 60 * 1000
		let minuteInterval = timeInterval.current >= 60 * 1000
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
		//update or draw chart whenever data changes
		if (data.length !== 0)
			if (chart.current == null) {//Highcharts.charts.length <= 
				chart.current = Highcharts.stockChart(chartEl.current, {
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
			        title: {
			        	text: 'AAPL Stock Price'
			        },
			        loading: {
				        labelStyle: {
				        	fontFamily: 'Arial'
				        }
				    },
			        series: [{
				        type: 'candlestick',
				        name: 'AAPL Stock Price',
				        data: data,
				        dataGrouping: {
					        units: [
					        	['minute',[10]],
					        	['hour', [1]],
					        	['week',[1]], 
					        	['month', [1, 2, 3, 4, 6]]]
				        },
			        }],
			        xAxis: {
			        	// tickInterval: timeInterval.current,
			        	plotBands: [{
			        		color: '#f2fffc',
			        		from: data[data.length - 1] ? (data[data.length - 1][0] + timeInterval.current/2) : 0,
			        		to: 100000000000000,
			        	}]
			        }
			    })
			} else {
				let oldExtremes = chart.current.xAxis[0].getExtremes()
				chart.current.update({
					series: [{
				        type: 'candlestick',
				        data: data,
				        dataGrouping: {
					        units: [
					        	['minute', [10]],
					        	['hour', [1]],
					        	['week', [1]], 
					        	['month', [1, 2, 3, 4, 6]]]
				        }
			        }]
				}, true, false, true)
				//fix scroll position after update
				let extremes = chart.current.xAxis[0].getExtremes()
				let newMax = extremes.dataMax
				let newMin = extremes.dataMax - (extremes.max - extremes.min)
				if (oldExtremes.max == oldExtremes.dataMax) {
					chart.current.xAxis[0].setExtremes(newMin, newMax)
				}
				chart.current.hideLoading()
			}
	}, [data])
	
	return(
		<div>
			<div ref={chartEl} style={{'height': '700px', 'minWidth': "310px"}}></div>
		</div>
		);
}

export default CandlestickChart;