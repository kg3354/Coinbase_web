// import React, { useState, useEffect } from 'react';
// import BitcoinPriceGraph from './BitcoinPriceGraph';

// function App() {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [granularity, setGranularity] = useState(3600);
//   const [disableDecrease, setDisableDecrease] = useState(false);

//   const allowedGranularities = [60, 300, 900, 3600, 21600, 86400];

//   useEffect(() => {
//     // Ensure that the dates do not exceed the current time upon any change
//     const now = new Date().toISOString().slice(0, 16);
//     if (new Date(startDate) >= new Date(now)) {
//       setStartDate(now);
//     }
//     if (new Date(endDate) > new Date(now)) {
//       setEndDate(now);
//     }
//   }, [startDate, endDate]);

//   const increaseGranularity = () => {
//     if (disableDecrease && granularity !== allowedGranularities[allowedGranularities.length - 1]) {
//       setDisableDecrease(false);
//     }
//     setGranularity((prevGranularity) => {
//       const currentIndex = allowedGranularities.indexOf(prevGranularity);
//       return currentIndex < allowedGranularities.length - 1 ? allowedGranularities[currentIndex + 1] : prevGranularity;
//     });
//   };

//   const decreaseGranularity = () => {
//     setGranularity((prevGranularity) => {
//       const currentIndex = allowedGranularities.indexOf(prevGranularity);
//       return currentIndex > 0 ? allowedGranularities[currentIndex - 1] : prevGranularity;
//     });
//   };

//   const handleGranularityError = () => {
//     setDisableDecrease(true);
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Bitcoin Price Tracker</h1>
//         <div>
//           <label>Start Date: </label>
//           <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value.slice(0, 16))} />
//           <label>End Date: </label>
//           <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value.slice(0, 16))} />
//           <label>Granularity: </label>
//           <button onClick={decreaseGranularity} disabled={disableDecrease || granularity === allowedGranularities[0]}>
//             Decrease Granularity
//           </button>
//           <button onClick={increaseGranularity} disabled={granularity === allowedGranularities[allowedGranularities.length - 1]}>
//             Increase Granularity
//           </button>
//         </div>
//       </header>
//       <BitcoinPriceGraph 
//         startDate={startDate} 
//         endDate={endDate} 
//         granularity={granularity} 
//         onGranularityError={handleGranularityError}
//       />
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import BitcoinPriceGraph from './BitcoinPriceGraph';

function App() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [granularity, setGranularity] = useState(3600);
  const [disableDecrease, setDisableDecrease] = useState(false);

  const allowedGranularities = [60, 300, 900, 3600, 21600, 86400];

  useEffect(() => {
    // Ensure that the dates do not exceed the current time upon any change
    const now = moment().toISOString().slice(0, 16);
    if (moment(startDate).isAfter(now)) {
      setStartDate(now);
    }
    if (moment(endDate).isAfter(now)) {
      setEndDate(now);
    }
  }, [startDate, endDate]);

  const increaseGranularity = () => {
    if (disableDecrease && granularity !== allowedGranularities[allowedGranularities.length - 1]) {
      setDisableDecrease(false);
    }
    setGranularity((prevGranularity) => {
      const currentIndex = allowedGranularities.indexOf(prevGranularity);
      return currentIndex < allowedGranularities.length - 1 ? allowedGranularities[currentIndex + 1] : prevGranularity;
    });
  };

  const decreaseGranularity = () => {
    setGranularity((prevGranularity) => {
      const currentIndex = allowedGranularities.indexOf(prevGranularity);
      return currentIndex > 0 ? allowedGranularities[currentIndex - 1] : prevGranularity;
    });
  };

  const handleGranularityError = () => {
    setDisableDecrease(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bitcoin Price Tracker</h1>
        <div>
          <label>Start Date: </label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(moment(e.target.value).format('YYYY-MM-DDTHH:mm'))}
          />
          <label>End Date: </label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(moment(e.target.value).format('YYYY-MM-DDTHH:mm'))}
          />
          <label>Granularity: </label>
          <button onClick={decreaseGranularity} disabled={disableDecrease || granularity === allowedGranularities[0]}>
            Decrease Granularity
          </button>
          <button onClick={increaseGranularity} disabled={granularity === allowedGranularities[allowedGranularities.length - 1]}>
            Increase Granularity
          </button>
        </div>
      </header>
      <BitcoinPriceGraph 
        startDate={startDate} 
        endDate={endDate} 
        granularity={granularity} 
        onGranularityError={handleGranularityError}
      />
    </div>
  );
}

export default App;
