const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const moment = require('moment-timezone');
const { exec } = require('child_process');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
app.use(cors({
  origin: '*', // This is broad; consider restricting to specific origins for production
  methods: ['GET', 'POST'],
}));

app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Function to run all_product.js
const runAllProductScript = () => {
  exec('node all_product.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing all_product.js: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error output: ${stderr}`);
      return;
    }
    console.log('all_product.js script output:', stdout);
  });
};

// Run all_product.js script on server start
runAllProductScript();

function isValidDate(dateString) {
  return moment(dateString, moment.ISO_8601, true).isValid();
}

const allowedGranularities = [60, 300, 900, 3600, 21600, 86400];

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

app.get('/api/sandbox-assets', (req, res) => {
  exec('node my_asset.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing my_asset.js: ${error.message}`);
      return res.status(500).send('Failed to fetch sandbox assets.');
    }
    if (stderr) {
      console.error(`Error output: ${stderr}`);
      return res.status(500).send('Failed to fetch sandbox assets.');
    }
    try {
      const data = JSON.parse(stdout);
      res.json(data);
    } catch (parseError) {
      console.error(`Error parsing JSON: ${parseError.message}`);
      res.status(500).send('Failed to parse sandbox assets data.');
    }
  });
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).send('Message is required');
  }

  const pythonProcess = spawn('python3', ['openai_chat.py', message]);

  let output = '';
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error from Python script: ${data.toString()}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send({ error: 'Failed to get response from OpenAI' });
    }
    try {
      const response = JSON.parse(output);
      res.json(response);
    } catch (err) {
      res.status(500).send({ error: 'Failed to parse response from OpenAI' });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
