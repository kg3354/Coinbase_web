// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const rateLimit = require('express-rate-limit');
// const moment = require('moment-timezone');
// const { exec } = require('child_process');
// const path = require('path');

// const app = express();
// app.use(cors({
//   origin: '*', // This is broad; consider restricting to specific origins for production
//   methods: ['GET', 'POST'],
// }));

// app.use(express.json());
// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// }));

// // Function to run all_product.js
// const runAllProductScript = () => {
//   exec('node all_product.js', (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error executing all_product.js: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.error(`Error output: ${stderr}`);
//       return;
//     }
//     console.log('all_product.js script output:', stdout);
//   });
// };

// // Run all_product.js script on server start
// runAllProductScript();

// function isValidDate(dateString) {
//   return moment(dateString, moment.ISO_8601, true).isValid();
// }

// const allowedGranularities = [60, 300, 900, 3600, 21600, 86400];

// function findNearestGranularity(granularity) {
//   return allowedGranularities.find(g => granularity <= g) || allowedGranularities[allowedGranularities.length - 1];
// }

// app.get('/api/prices', async (req, res) => {
//   let { start, end, granularity, asset } = req.query;

//   const now = moment().toISOString();

//   if (!isValidDate(start)) {
//     start = moment().subtract(1, 'days').toISOString();
//   }

//   if (!isValidDate(end) || moment(end).isAfter(now)) {
//     end = now;
//   }

//   let numericGranularity = parseInt(granularity);
//   if (isNaN(numericGranularity) || !allowedGranularities.includes(numericGranularity)) {
//     numericGranularity = 3600; // default granularity to 1 hour
//   }

//   const startTime = moment(start).valueOf();
//   const endTime = moment(end).valueOf();
//   const timeRange = (endTime - startTime) / 1000; // in seconds

//   if (timeRange / numericGranularity > 300) {
//     return res.status(400).send({
//       message: 'Granularity too small for the requested time range. Count of aggregations requested exceeds 300.'
//     });
//   }

//   const config = {
//     method: 'get',
//     url: `https://api.exchange.coinbase.com/products/${asset}/candles?start=${start}&end=${end}&granularity=${numericGranularity}`,
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };

//   try {
//     const response = await axios(config);
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching candle data:', error.response ? error.response.data : error.message);
//     res.status(500).send('Failed to fetch data.');
//   }
// });

// app.get('/api/sandbox-assets', (req, res) => {
//   exec('node my_asset.js', (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error executing my_asset.js: ${error.message}`);
//       return res.status(500).send('Failed to fetch sandbox assets.');
//     }
//     if (stderr) {
//       console.error(`Error output: ${stderr}`);
//       return res.status(500).send('Failed to fetch sandbox assets.');
//     }
//     try {
//       const data = JSON.parse(stdout);
//       res.json(data);
//     } catch (parseError) {
//       console.error(`Error parsing JSON: ${parseError.message}`);
//       res.status(500).send('Failed to parse sandbox assets data.');
//     }
//   });
// });


// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import React, { useState } from 'react';
import AssetPriceGraph from './AssetPriceGraph';
import currencyPairs from './currencyPairs.json';
import moment from 'moment';
import axios from 'axios';

function App() {
  const [currencyPairsState, setCurrencyPairsState] = useState([
    {
      base: 'BTC', 
      quote: 'USD', 
      startDate: moment().subtract(1, 'days').format('YYYY-MM-DDTHH:mm'), 
      endDate: moment().format('YYYY-MM-DDTHH:mm'), 
      granularity: 3600
    }
  ]);
  const [sandboxAssets, setSandboxAssets] = useState([]);
  const [showSandboxAssets, setShowSandboxAssets] = useState(false);
  const allowedGranularities = [60, 300, 900, 3600, 21600, 86400];

  const fetchSandboxAssets = async () => {
    console.log('Calling my_asset.js...');
    try {
      const response = await axios.get(`http://${window.location.hostname}:3000/api/sandbox-assets`);
      console.log('Sandbox assets fetched:', response.data);
      setSandboxAssets(response.data);
      setShowSandboxAssets(true);
    } catch (error) {
      console.error('Error fetching sandbox assets:', error);
    }
  };

  const handleAddPair = () => {
    setCurrencyPairsState([
      ...currencyPairsState,
      {
        base: 'BTC', 
        quote: 'USD', 
        startDate: moment().subtract(1, 'days').format('YYYY-MM-DDTHH:mm'), 
        endDate: moment().format('YYYY-MM-DDTHH:mm'), 
        granularity: 3600
      }
    ]);
  };

  const handleRemovePair = (index) => {
    setCurrencyPairsState(currencyPairsState.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newPairs = [...currencyPairsState];
    newPairs[index][field] = value;

    if (field === 'startDate' && moment(value).isSameOrAfter(moment(newPairs[index].endDate))) {
      newPairs[index].startDate = moment(newPairs[index].endDate).subtract(1, 'minutes').format('YYYY-MM-DDTHH:mm');
    }
    if (field === 'endDate' && moment(value).isSameOrBefore(moment(newPairs[index].startDate))) {
      newPairs[index].endDate = moment(newPairs[index].startDate).add(1, 'minutes').format('YYYY-MM-DDTHH:mm');
    }

    setCurrencyPairsState(newPairs);
  };

  const setEndDate = (index, value) => {
    const newPairs = [...currencyPairsState];
    if (moment(value).isSameOrBefore(moment(newPairs[index].startDate))) {
      newPairs[index].endDate = moment(newPairs[index].startDate).add(1, 'minutes').format('YYYY-MM-DDTHH:mm');
    } else {
      newPairs[index].endDate = value;
    }
    setCurrencyPairsState(newPairs);
  };

  const granularityToString = (granularity) => {
    switch (granularity) {
      case 60: return "1 Minute";
      case 300: return "5 Minutes";
      case 900: return "15 Minutes";
      case 3600: return "1 Hour";
      case 21600: return "6 Hours";
      case 86400: return "1 Day";
      default: return `${granularity} Seconds`;
    }
  };

  return (
    <div className="App" style={{ backgroundColor: '#f5f5f5' }}>
      <header className="App-header" style={{ padding: '20px', position: 'relative' }}>
        <h1>Asset Price Tracker</h1>
        <p>Author: Kaiwen Guo</p>
        <p>Silver 8 Capital SWE Round 2 Take Home Assessment</p>
        <button
          style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}
          onClick={fetchSandboxAssets}
        >
          My Sandbox Asset
        </button>
        {showSandboxAssets && (
          <div className="sandbox-assets-container">
            <span className="close-button" onClick={() => setShowSandboxAssets(false)}>×</span>
            <h2>Sandbox Assets</h2>
            {sandboxAssets.map(account => (
              <div key={account.id} style={{ marginBottom: '10px' }}>
                <p><strong>Currency:</strong> {account.display_name} ({account.currency})</p>
                <p><strong>Balance:</strong> {account.balance}</p>
                <p><strong>Available:</strong> {account.available}</p>
                <p><strong>Hold:</strong> {account.hold}</p>
                <p><strong>Trading Enabled:</strong> {account.trading_enabled ? 'Yes' : 'No'}</p>
                <p><strong>Pending Deposit:</strong> {account.pending_deposit}</p>
                <hr />
              </div>
            ))}
          </div>
        )}
        {currencyPairsState.map((pair, index) => (
          <div key={index} style={{ borderBottom: '2px solid #ccc', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: '24px', marginRight: '10px' }}>{pair.base}</span>
              <span style={{ margin: '0 10px' }}> / </span>
              <img src={`/image/${pair.quote.toLowerCase()}.png`} alt={pair.quote} style={{ width: 50, height: 50 }} onError={(e) => { e.target.onerror = null; e.target.src="/image/default.png"; }} />
            </div>
            <div>
              <label>Base Currency: </label>
              <select value={pair.base} onChange={e => handleChange(index, 'base', e.target.value)}>
                {Object.keys(currencyPairs).map(base => (
                  <option key={base} value={base}>{base}</option>
                ))}
              </select>
              <label>Quote Currency: </label>
              <select value={pair.quote} onChange={e => handleChange(index, 'quote', e.target.value)}>
                {currencyPairs[pair.base].map(quote => (
                  <option key={quote} value={quote}>{quote}</option>
                ))}
              </select>
              <button onClick={() => handleRemovePair(index)}>Remove</button>
            </div>
            <div>
              <label>Start Date: </label>
              <input type="datetime-local" value={pair.startDate} onChange={e => handleChange(index, 'startDate', e.target.value)} />
              <label>End Date: </label>
              <input type="datetime-local" value={pair.endDate} onChange={e => handleChange(index, 'endDate', e.target.value)} />
              <label>Granularity: </label>
              <select value={pair.granularity} onChange={e => handleChange(index, 'granularity', parseInt(e.target.value))}>
                {allowedGranularities.map(g => (
                  <option key={g} value={g}>{granularityToString(g)}</option>
                ))}
              </select>
            </div>
            <AssetPriceGraph
              baseCurrency={pair.base}
              quoteCurrency={pair.quote}
              startDate={pair.startDate}
              endDate={pair.endDate}
              setEndDate={(value) => setEndDate(index, value)}
              granularity={pair.granularity}
              onGranularityError={() => {}}
            />
          </div>
        ))}
        <button onClick={handleAddPair}>Add Currency Pair</button>
      </header>
    </div>
  );
}

export default App;
