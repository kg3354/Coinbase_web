import React, { useState } from 'react';
import AssetPriceGraph from './AssetPriceGraph';
import currencyPairs from './currencyPairs.json';
import moment from 'moment';
import axios from 'axios';
import './App.css';
import ChatBox from './ChatBox'; 

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
  const [showChatBox, setShowChatBox] = useState(false); // State for chatbox visibility
  const allowedGranularities = [60, 300, 900, 3600, 21600, 86400];

  const fetchSandboxAssets = async () => {
    if (showSandboxAssets) {
      setShowSandboxAssets(false);
      return;
    }

    console.log('Fetching sandbox assets...'); // Log to verify button click
    try {
      const response = await axios.get(`http://${window.location.hostname}:3000/api/sandbox-assets`);
      console.log('Sandbox assets fetched:', response.data); // Log to verify data
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

    if (field === 'base') {
      newPairs[index].quote = currencyPairs[value][0];
    }

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
        <button
          style={{ position: 'absolute', top: '60px', right: '20px', zIndex: 1000 }}
          onClick={() => setShowChatBox(!showChatBox)}
        >
          Ask GPT
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
        {showChatBox && (
          <ChatBox onClose={() => setShowChatBox(false)} />
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
              <input 
                type="datetime-local" 
                value={pair.startDate} 
                onChange={e => handleChange(index, 'startDate', e.target.value)} 
                max={moment(pair.endDate).subtract(1, 'minutes').format('YYYY-MM-DDTHH:mm')}
              />
              <label>End Date: </label>
              <input 
                type="datetime-local" 
                value={pair.endDate} 
                onChange={e => handleChange(index, 'endDate', e.target.value)} 
                max={moment().format('YYYY-MM-DDTHH:mm')}
                min={moment(pair.startDate).add(1, 'minutes').format('YYYY-MM-DDTHH:mm')}
              />
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
