import React, { useState } from 'react';
import axios from 'axios';
import PriceChart from './PriceChart';

function App() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [granularity, setGranularity] = useState(60); // Default granularity
  const [data, setData] = useState([]);

  const fetchData = async () => {
    if (!startDate || !endDate) {
      alert("Please enter valid start and end dates.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/prices`, {
        params: { start: startDate, end: endDate, granularity }
      });
      setData(response.data);
    } catch (error) {
      alert("Failed to fetch data. " + error.message);
    }
  };

  return (
    <div className="App">
      <h1>Bitcoin Historical Prices</h1>
      <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} />
      <input type="number" value={granularity} onChange={e => setGranularity(parseInt(e.target.value))} />
      <button onClick={fetchData}>Fetch Data</button>
      {data.length > 0 && <PriceChart data={data} />}
    </div>
  );
}

export default App;
