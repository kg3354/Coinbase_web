import React, { useState, useEffect } from 'react';
import AssetPriceGraph from './AssetPriceGraph';
import currencyPairs from './currencyPairs.json'; // Assuming this is correctly placed in src and accessible
import moment from 'moment';

function App() {
  const defaultStartDate = moment().subtract(1, 'days');
  const defaultEndDate = moment();

  const [selectedBase, setSelectedBase] = useState('BTC');
  const [selectedQuote, setSelectedQuote] = useState('USD');
  const [startDate, setStartDate] = useState(defaultStartDate.format('YYYY-MM-DDTHH:mm'));
  const [endDate, setEndDate] = useState(defaultEndDate.format('YYYY-MM-DDTHH:mm'));
  const [granularity, setGranularity] = useState(3600);
  const [disableDecrease, setDisableDecrease] = useState(false);
  const allowedGranularities = [60, 300, 900, 3600, 21600, 86400];

  useEffect(() => {
    // Initialize default quote currency
    setSelectedQuote(currencyPairs['BTC'].includes('USD') ? 'USD' : currencyPairs['BTC'][0]);
  }, []);

  const handleBaseCurrencyChange = (e) => {
    const newBase = e.target.value;
    setSelectedBase(newBase);
    setSelectedQuote(currencyPairs[newBase][0]); // Automatically update to the first quote currency
  };

  const handleQuoteCurrencyChange = (e) => {
    setSelectedQuote(e.target.value);
  };

  const getCurrencyImageUrl = (currency) => `/image/${currency.toLowerCase()}.png`;

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Asset Price Tracker</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <img src={getCurrencyImageUrl(selectedBase)} alt={selectedBase} style={{ width: 50, height: 50 }} />
          <span style={{ margin: '0 10px' }}> / </span>
          <img src={getCurrencyImageUrl(selectedQuote)} alt={selectedQuote} style={{ width: 50, height: 50 }} />
        </div>
        <div>
          <label>Base Currency: </label>
          <select value={selectedBase} onChange={handleBaseCurrencyChange}>
            {Object.keys(currencyPairs).map(base => (
              <option key={base} value={base}>{base}</option>
            ))}
          </select>
          <br />
          <label>Quote Currency: </label>
          <select value={selectedQuote} onChange={handleQuoteCurrencyChange}>
            {currencyPairs[selectedBase].map(quote => (
              <option key={quote} value={quote}>{quote}</option>
            ))}
          </select>
          <br />
          <label>Start Date: </label>
          <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <label>End Date: </label>
          <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <br />
          <label>Granularity: </label>
          <button onClick={handleDecreaseGranularity} disabled={granularity === allowedGranularities[0] || disableDecrease}>
            Decrease Granularity
          </button>
          <button onClick={handleIncreaseGranularity} disabled={granularity === allowedGranularities[allowedGranularities.length - 1]}>
            Increase Granularity
          </button>
          <br />
          <strong>Time Range: </strong>{moment(startDate).format('MMM D, YYYY HH:mm')} to {moment(endDate).format('MMM D, YYYY HH:mm')}
        </div>
      </header>
      <AssetPriceGraph 
        baseCurrency={selectedBase}
        quoteCurrency={selectedQuote}
        startDate={startDate}
        endDate={endDate}
        granularity={granularity}
        onGranularityError={() => setDisableDecrease(true)}
      />
    </div>
  );
}

export default App;
