import React, {useState, useEffect, useRef} from 'react';
import CandlestickChart from './CandlestickChart';
import GeneralChart from './GeneralChart';
import axios from 'axios'

function App() {
  // let dataArr = [[1555335000000,49.81],[1555421400000,49.81],[1555507800000,50.78],[1555594200000,50.97],[1555939800000,51.13],[1556026200000,51.87],[1556112600000,51.79],[1556199000000,51.32],[1556285400000,51.08]]
  // let dataArr = [[1483232400000, 1.4, 4.7],[1483318800000, -1.3, 1.9],[1483405200000, -0.7, 4.3],[1483491600000, -5.5, 3.2],[1483578000000, -9.9, -6.6],[1483664400000, -9.6, 0.1],[1483750800000, -0.9, 4.0],[1483837200000, -2.2, 2.9],[1483923600000, 1.3, 2.3],[1484010000000, -0.3, 2.9],[1484096400000, 1.1, 3.8],[1484182800000, 0.6, 2.1],[1484269200000, -3.4, 2.5],[1484355600000, -2.9, 2.0],[1484442000000, -5.7, -2.6],[1484528400000, -8.7, -3.3],]  
  // let dataArr = [[1555335000000,49.65,49.96,49.5,49.81],[1555421400000,49.87,50.34,49.64,49.81],[1555507800000,49.88,50.85,49.65,50.78],[1555594200000,50.78,51.04,50.63,50.97],[1555939800000,50.71,51.24,50.58,51.13],[1556026200000,51.11,51.94,50.97,51.87],[1556112600000,51.84,52.12,51.76,51.79],[1556199000000,51.71,51.94,51.28,51.32],[1556285400000,51.22,51.25,50.53,51.08],[1556544600000,51.1,51.49,50.97,51.15]]
  // let firstTime = dataArr[0][0]
  // dataArr = dataArr.map((el, idx) => [firstTime + 1 * 60 * 60 * 1000 * (idx + 1)].concat(el.slice(1)))
  const [data, setData] = useState([])
  useEffect(() => {
	  axios.get('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/range.json')
	    .then(function (response) {
			    let firstTime = response.data[0][0]
		    	setData(response.data)
			    // setData(response.data.map((el, idx) => [firstTime + 1 * 60 * 1000 * (idx + 1)].concat(el.slice(1))))
			})
	    .catch(function (error) {
		    console.log(error);
	    })
	}, [])
  return (
  	<div>
	    {/*<CandlestickChart />*/}
	    <GeneralChart data={data} name={'Sample'} type={'areasplinerange'}/>
  	</div>
  );
}

export default App;
