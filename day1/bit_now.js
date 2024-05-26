const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to format the date to ISO without milliseconds
function formatDate(date) {
  return date.toISOString().slice(0, -5) + 'Z';
}

// Function to check if a date string is valid
function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

// Allowed granularity values in seconds
const allowedGranularities = [60, 300, 900, 3600, 21600, 86400];

// Function to find the nearest allowed granularity
function findNearestGranularity(granularity) {
  for (let i = 0; i < allowedGranularities.length; i++) {
    if (granularity <= allowedGranularities[i]) {
      return allowedGranularities[i];
    }
  }
  return allowedGranularities[allowedGranularities.length - 1];
}

rl.question('Enter the start date and time (YYYY-MM-DDTHH:mm:ss) or type "default" for 1 day earlier: ', (input) => {
  let startDate;

  if (input.toLowerCase() === 'default') {
    // Set start date to 1 day earlier from now
    const date = new Date();
    date.setDate(date.getDate() - 1);
    startDate = formatDate(date);
  } else if (isValidDate(input)) {
    startDate = formatDate(new Date(input));
  } else {
    console.log('Invalid start date format. Using default of 1 day earlier.');
    const date = new Date();
    date.setDate(date.getDate() - 1);
    startDate = formatDate(date);
  }

  rl.question('Enter the end date and time (YYYY-MM-DDTHH:mm:ss) or type "now" for the current time: ', (endInput) => {
    let endDate;
    const now = new Date();

    if (endInput.toLowerCase() === 'now') {
      endDate = formatDate(now); // Set end date to current time
    } else if (isValidDate(endInput)) {
      const inputEndDate = new Date(endInput);
      if (inputEndDate > now) {
        console.log('End date is in the future. Using current time as end date.');
        endDate = formatDate(now);
      } else {
        endDate = formatDate(inputEndDate);
      }ss
    } else {
      console.log('Invalid end date format. Using current time as end date.');
      endDate = formatDate(now);
    }

    rl.question('Enter the granularity in seconds (default is 3600): ', (granularityInput) => {
      let granularity = 3600; // Default to 1 minute

      if (granularityInput) {
        const inputGranularity = parseInt(granularityInput, 10);
        if (allowedGranularities.includes(inputGranularity)) {
          granularity = inputGranularity;
        } else {
          console.log(`Invalid granularity. Using default of 60 seconds.`);
        }
      }

      console.log(`Fetching data from ${startDate} to ${endDate} with granularity ${granularity} seconds...`);

      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const maxDataPoints = 300;
      const timeRange = (end - start) / 1000; // in seconds

      if (timeRange / granularity > maxDataPoints) {
        console.log(`Time range is too large for the selected granularity. Adjusting granularity...`);
        granularity = Math.ceil(timeRange / maxDataPoints);
        granularity = findNearestGranularity(granularity);
        console.log(`New granularity: ${granularity} seconds`);
      }

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.exchange.coinbase.com/products/BTC-USD/candles?start=${startDate}&end=${endDate}&granularity=${granularity}`,
        headers: { 
          'Content-Type': 'application/json'
        }
      };

      axios.request(config)
      .then((response) => {
        const formattedData = response.data.map(candle => {
          return {
            'Date and Time': new Date(candle[0] * 1000).toLocaleString(),
            'Lowest Price (USD)': `$${candle[1].toFixed(2)}`,
            'Highest Price (USD)': `$${candle[2].toFixed(2)}`,
            'Opening Price (USD)': `$${candle[3].toFixed(2)}`,
            'Closing Price (USD)': `$${candle[4].toFixed(2)}`,
            'Trading Volume': `${candle[5].toFixed(4)} BTC`
          };
        });
        console.log(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching candle data:', error.response ? error.response.data : error.message);
      });

      rl.close();
    });
  });
});
