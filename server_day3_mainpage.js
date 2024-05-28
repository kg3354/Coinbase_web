const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const moment = require('moment-timezone');

const app = express();
app.use(cors());
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

function isValidDate(dateString) {
  return moment(dateString, moment.ISO_8601, true).isValid();
}

const allowedGranularities = [60, 300, 900, 3600, 21600, 86400];

function findNearestGranularity(granularity) {
  return allowedGranularities.find(g => granularity <= g) || allowedGranularities[allowedGranularities.length - 1];
}

app.get('/api/prices', async (req, res) => {
  let { start, end, granularity, asset } = req.query;

  const now = moment().toISOString();

  if (!isValidDate(start)) {
    start = moment().subtract(1, 'days').toISOString();
  }

  if (!isValidDate(end) || moment(end).isAfter(now)) {
    end = now;
  }

  let numericGranularity = parseInt(granularity);
  if (isNaN(numericGranularity) || !allowedGranularities.includes(numericGranularity)) {
    numericGranularity = 3600; // default granularity to 1 hour
  }

  const startTime = moment(start).valueOf();
  const endTime = moment(end).valueOf();
  const timeRange = (endTime - startTime) / 1000; // in seconds

  if (timeRange / numericGranularity > 300) {
    return res.status(400).send({
      message: 'Granularity too small for the requested time range. Count of aggregations requested exceeds 300.'
    });
  }

  const config = {
    method: 'get',
    url: `https://api.exchange.coinbase.com/products/${asset}/candles?start=${start}&end=${end}&granularity=${numericGranularity}`,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching candle data:', error.response ? error.response.data : error.message);
    res.status(500).send('Failed to fetch data.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
