import CandlestickChart from './CandlestickChart';
import GeneralChart from './GeneralChart';

function App() {
  let data = [[1555335000000,49.81],[1555421400000,49.81],[1555507800000,50.78],[1555594200000,50.97],[1555939800000,51.13],[1556026200000,51.87],[1556112600000,51.79],[1556199000000,51.32],[1556285400000,51.08]]
  return (
  	<div>
	    {/*<CandlestickChart />*/}
	    <GeneralChart data={data} name={'Sample'} type={'line'}/>
  	</div>
  );
}

export default App;
