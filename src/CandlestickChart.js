import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Highcharts from 'highcharts/highstock';
// Load the exporting module.
import Exporting from 'highcharts/modules/exporting';
// Initialize exporting module. (CommonJS only)
Exporting(Highcharts);

function CandlestickChart(props) {
	const [data, setData] = useState([])
	useEffect(() => {
		//initial data load and interval setup
		if (data.length == 0)
		axios.get('https://demo-live-data.highcharts.com/aapl-ohlc.json')
		    .then(function (response) {
	    		setData(data => response.data)
	  		})
		    .catch(function (error) {
			    console.log(error);
		    })
	    const interval = setInterval(() => {
	    	//interval to update chart periodically
		    Highcharts.charts[Highcharts.charts.length - 1].showLoading()
		    axios.get('https://demo-live-data.highcharts.com/aapl-ohlc.json')
				.then((response) => {
					//put new data after old data
					let newData = response.data.slice(response.data.length - 2)
				    let lastTime = data[data.length - 1][0]
				    newData = newData.map((el, idx) => [lastTime + 86400000 * (idx + 1)].concat(el.slice(1)))
				    setData(data.concat(newData))
				})
				.catch((error) => {
					console.log(error)
				})
		  }, 60 * 1000);
		  return () => clearInterval(interval);
	});

	useEffect(() => {
		//update or draw chart whenever data changes
		if (Highcharts.charts.length <= 1) {//Highcharts.charts.length <= 
			Highcharts.stockChart('highcharts-candlestick-container-1', {
		        rangeSelector: {
		        	selected: 1
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
				        units: [['week', // unit name
				        	[1] // allowed multiples
				            ], ['month', [1, 2, 3, 4, 6]]]
			        }
		        }]
		    },() => {
		    	Highcharts.charts[Highcharts.charts.length - 1].hideLoading()
		    })
		} else {
			let oldExtremes = Highcharts.charts[Highcharts.charts.length - 1].xAxis[0].getExtremes()
			Highcharts.charts[Highcharts.charts.length - 1].update({
				series: [{
			        type: 'candlestick',
			        data: data,
			        dataGrouping: {
				        units: [['week', // unit name
				        	[1] // allowed multiples
				            ], ['month', [1, 2, 3, 4, 6]]]
			        }
		        }]
			}, true, false, true)
			//fix scroll position after update
			let extremes = Highcharts.charts[Highcharts.charts.length - 1].xAxis[0].getExtremes()
			let newMax = extremes.dataMax
			let newMin = extremes.dataMax - (extremes.max - extremes.min)
			if (oldExtremes.max == oldExtremes.dataMax) {
				Highcharts.charts[Highcharts.charts.length - 1].xAxis[0].setExtremes(newMin, newMax)
			}
			Highcharts.charts[Highcharts.charts.length - 1].hideLoading()
		}
	}, [data])
	
	return(
		<div>
			<div id="highcharts-candlestick-container-1" style={{'height': '400px', 'minWidth': "310px"}}></div>
		</div>
		);
}

export default CandlestickChart;