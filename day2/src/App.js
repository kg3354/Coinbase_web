import React, { useState } from 'react';
import axios from 'axios';
import PriceChart from './PriceChart';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [granularity, setGranularity] = useState(60);
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
      alert("Failed to fetch data: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Bitcoin Historical Prices</h1>
      <div className="form-group">
        <label>Start Date</label>
        <input type="datetime-local" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label>End Date</label>
        <input type="datetime-local" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Granularity (Seconds)</label>
        <input type="number" className="form-control" value={granularity} onChange={e => setGranularity(parseInt(e.target.value, 10))} />
      </div>
      <button onClick={fetchData} className="btn btn-primary">Fetch Data</button>
      {data.length > 0 && <PriceChart data={data} />}
    </div>
  );
}

export default App;
