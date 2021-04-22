import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import Highcharts from 'highcharts/highstock';

function CandlestickChart(props) {
	const [data, setData] = useState({historic: [], prediction: []})
	const chart = useRef(null)
	const chartEl = useRef(null)
	const timeInterval = useRef(0)
	Highcharts.setOptions({
	    global: {
	        timezoneOffset: new Date().getTimezoneOffset(),
	    },
	});
	const updateData = () => {
		const historicRequest = axios.get('http://192.168.11.35/processing/list/conv/tBTCUSD/1H/get?from=1545419851000')
		//1614496763000
		// const predictionReqest = axios.get('http://192.168.11.34:8080/pricebased/prediction/time/tBTCUSD/1H/1618830000000')
		const predictionReqest = axios.get('http://192.168.11.34:8080/pricebased/prediction/tBTCUSD/1H/10/')
		axios.all([historicRequest, predictionReqest]).then(axios.spread((...responses) => {
			let historicData = responses[0].data.map((point) => {
	    		return [
	    			point.timestamp, 
	    			Number(point.open_price), 
	    			Number(point.high_price), 
	    			Number(point.low_price), 
	    			Number(point.close_price),
	    		]
	    	})
	    	let predictionData = responses[1].data.map((point) => {
	    		return [
	    			point.prediction[0].timestamp_predict,
	    			point.prediction[0].open_prediction,
	    			point.prediction[0].high_prediction,
	    			point.prediction[0].low_prediction,
	    			point.prediction[0].close_prediction,
	    		]
	    	})
	    	predictionData.sort((a, b) => a[0] - b[0])
	    	historicData.sort((a, b) => a[0] - b[0])
	    	timeInterval.current = historicData[historicData.length - 1][0] - historicData[historicData.length - 2][0]
	    	setData({historic: historicData, prediction: []})
		})).catch((errors) => {
			console.log(errors)
		})
	}
	useEffect(() => {
		//initial data load and interval setup
		if (data.historic.length === 0) {
			updateData()
		}
	 //    const interval = setInterval(() => {
	 //    	if (chart.current) {
	 //    		chart.current.showLoading()
	 //    	}
	 //    	updateData()
		// }, 20 * 1000);
		// return () => clearInterval(interval);
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
		if (data.historic.length !== 0 && data.prediction.length !== 15)
			if (chart.current === null) {//Highcharts.charts.length <= 
				chart.current = Highcharts.stockChart(chartEl.current, {
				 	plotOptions: {
    					candlestick: {
    						grouping: false,
    					},
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
			        	text: 'Bitcoin Price'
			        },
			        loading: {
				        labelStyle: {
				        	fontFamily: 'Arial'
				        }
				    },
				    legend: {
				    	enabled: true,
				    },
			        series: [
				        {
				        	maxPointWidth: 16,
				        	showInLegend: true,
				        	opacity: '0.85',
				        	color: 'red',
				            lineColor: 'red',
				            upLineColor: 'green', // docs
				            upColor: 'green',
					        type: 'candlestick',
					        name: 'Bitcoin Price',
					        data: data.historic,
					        dataGrouping: {
						        units: [
						        	['minute',[10]],
						        	['hour', [1, 2, 10]],
						        	['day', [1]],
						        	['week',[1]], 
						        	['month', [1, 2, 3, 4, 6]]]
					        },
					        states: {
					        	inactive: {
					        		enabled: false,
					        	},
					        },
				        },
				        {
				        	maxPointWidth: 12,
				        	showInLegend: true,
				        	opacity: '1',
				        	color: 'black',
				            lineColor: 'black',
				            upLineColor: 'blue', // docs
				            upColor: 'blue',
					        type: 'candlestick',
					        name: 'Bitcoin Price Prediction',
					        data: data.prediction,
					        dataGrouping: {
						        units: [
						        	['minute',[10]],
						        	['hour', [1, 10]],
						        	['day', [1]],
						        	['week',[1]], 
						        	['month', [1, 2, 3, 4, 6]]]
					        },
					        states: {
					        	inactive: {
					        		enabled: false,
					        	},
					        	hover: {
					        		enabled: true,
					        		brightness: 1,
					        	},
					        },
				        },
			        ],
			    })
			} else {
				console.log('update')
				let oldExtremes = chart.current.xAxis[0].getExtremes()
				chart.current.update({
					series: [
						{data: data.historic},
						{data: data.prediction},
			        ]
				}, true, false, true)
				//fix scroll position after update
				let extremes = chart.current.xAxis[0].getExtremes()
				let newMax = extremes.dataMax
				let newMin = extremes.dataMax - (extremes.max - extremes.min)
				if (oldExtremes.max === oldExtremes.dataMax) {
					chart.current.xAxis[0].setExtremes(newMin, newMax)
				}
				chart.current.hideLoading()
			}
	}, [data])
	
	return(
		<div dir='rtl'>
			<div ref={chartEl} style={{'height': '700px', 'minWidth': "310px", 'maxWidth': "1000px", 'margin': '0 auto'}}></div>
		</div>
		);
}

export default CandlestickChart;