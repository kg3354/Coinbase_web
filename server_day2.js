const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

function formatDate(date) {
  return date.toISOString().slice(0, -5) + 'Z'; // Ensure the format is ISO without milliseconds
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime()); // Check if the date is valid
}

const allowedGranularities = [60, 300, 900, 3600, 21600, 86400]; // Define allowed granularities

function findNearestGranularity(granularity) {
  return allowedGranularities.find(g => granularity <= g) || allowedGranularities[allowedGranularities.length - 1];
}

app.get('/api/prices', async (req, res) => {
  const { start, end, granularity } = req.query;

  if (!isValidDate(start) || !isValidDate(end)) {
    return res.status(400).send('Invalid date format.');
  }

  const formattedStart = formatDate(new Date(start));
  const formattedEnd = formatDate(new Date(end));
  let numericGranularity = parseInt(granularity);

  if (!allowedGranularities.includes(numericGranularity)) {
    numericGranularity = findNearestGranularity(numericGranularity);
  }

  const config = {
    method: 'get',
    url: `https://api.exchange.coinbase.com/products/BTC-USD/candles?start=${formattedStart}&end=${formattedEnd}&granularity=${numericGranularity}`,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching candle data:', error.response ? error.response.data : error.message);
    res.status(500).send('Failed to fetch data.'); // Improved error handling
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
