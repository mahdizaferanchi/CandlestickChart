import React, {useState, useEffect, useRef} from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more';
HC_more(Highcharts);

// props.type should be one of these:
//'line', 'spline', 'area', 'areaspline', 'column', 'pie'
function Chart(props) {
	const validate = (data) => {
		let xValType = (typeof(data[0][0]) === 'string') ? 'category' : 'number'
		if (!props.data.every((el, idx, arr) => typeof(el[0]) === typeof(arr[0][0]))) {
			return false
		}
		if (!props.data.every((el) => el.length === 2)) {
			return false
		}
		return true
	}
	if (!validate(props.data)) {
		console.log('Invalid data or chart type')
	}
	const options = {
	  title: {
	    text: props.name,
	  },
	  xAxis: {
	  	type: 'category',
	  },
	  series: [{
	  	type: props.type,
	    data: props.data,
	    name: props.name,
	  }]
	}
	return(
		<div style={{'minWidth': '310px'}}>
			<HighchartsReact
				highcharts={Highcharts}
    			constructorType={'chart'}
    			options={options}
    		/>	
		</div>
		);
}

export default Chart;