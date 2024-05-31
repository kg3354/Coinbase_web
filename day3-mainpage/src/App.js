import React, { useState, useEffect } from 'react';
import AssetPriceGraph from './AssetPriceGraph';
import currencyPairs from './currencyPairs.json'; // Currency pairs metadata
import moment from 'moment'; // For date manipulation

function App() {
  // State initialization
  const [currencyPairsState, setCurrencyPairsState] = useState([
    { base: 'BTC', quote: 'USD', startDate: moment().subtract(1, 'days').format('YYYY-MM-DDTHH:mm'), endDate: moment().format('YYYY-MM-DDTHH:mm') }
  ]);
  const [granularity, setGranularity] = useState(3600);
  const [disableDecrease, setDisableDecrease] = useState(false);
  const allowedGranularities = [60, 300, 900, 3600, 21600, 86400];

  // Function to handle adding a new currency pair
  const handleAddPair = () => {
    setCurrencyPairsState([
      ...currencyPairsState,
      { base: 'BTC', quote: 'USD', startDate: moment().subtract(1, 'days').format('YYYY-MM-DDTHH:mm'), endDate: moment().format('YYYY-MM-DDTHH:mm') }
    ]);
  };

  // Function to remove a currency pair by index
  const handleRemovePair = (index) => {
    setCurrencyPairsState(currencyPairsState.filter((_, i) => i !== index));
  };

  // Function to handle changes to the base or quote currencies and date range
  const handleChange = (index, field, value) => {
    const newPairs = [...currencyPairsState];
    newPairs[index][field] = value;
    setCurrencyPairsState(newPairs);
  };

  // Functions to manage granularity
  const handleIncreaseGranularity = () => {
    const currentIndex = allowedGranularities.indexOf(granularity);
    if (currentIndex < allowedGranularities.length - 1) {
      setGranularity(allowedGranularities[currentIndex + 1]);
      setDisableDecrease(false);
    }
  };

  const handleDecreaseGranularity = () => {
    const currentIndex = allowedGranularities.indexOf(granularity);
    if (currentIndex > 0) {
      setGranularity(allowedGranularities[currentIndex - 1]);
    } else {
      setDisableDecrease(true);
    }
  };

  // Display granularity in a user-friendly format
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

  // Render the UI
  return (
    <div className="App">
      <header className="App-header">
        <h1>Asset Price Tracker</h1>
        {currencyPairsState.map((pair, index) => (
          <div key={index}>
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
            </div>
            <AssetPriceGraph
              baseCurrency={pair.base}
              quoteCurrency={pair.quote}
              startDate={pair.startDate}
              endDate={pair.endDate}
              granularity={granularity}
              onGranularityError={() => setDisableDecrease(true)}
            />
          </div>
        ))}
        <button onClick={handleAddPair}>Add Currency Pair</button>
        <div>
          <label>Granularity: </label>
          <span>{granularityToString(granularity)}</span>
          <button onClick={handleDecreaseGranularity} disabled={granularity === allowedGranularities[0] || disableDecrease}>
            Decrease Granularity
          </button>
          <button onClick={handleIncreaseGranularity} disabled={granularity === allowedGranularities[allowedGranularities.length - 1]}>
            Increase Granularity
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
