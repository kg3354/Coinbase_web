const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Define the configuration for the GET request
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.exchange.coinbase.com/products/',
  headers: { 
    'Content-Type': 'application/json'
  }
};

// Send the request
axios.request(config)
.then((response) => {
  // Parse the JSON response
  const data = response.data;

  // Prepare the output string
  let output = '';

  // Check if the data is an array and iterate over it
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      output += `Product ${index + 1}:\n`;
      output += `  ID: ${item.id}\n`;
      output += `  Base Currency: ${item.base_currency}\n`;
      output += `  Quote Currency: ${item.quote_currency}\n`;
      output += `  Display Name: ${item.display_name}\n`;
      output += `  Market Types: ${item.market_types.join(', ')}\n`;
      output += `  Spot Volume (24h): ${item.spot_volume_24hour}\n`;
      output += `  Spot Volume (30d): ${item.spot_volume_30day}\n`;
      output += `  RFQ Volume (24h): ${item.rfq_volume_24hour}\n`;
      output += `  RFQ Volume (30d): ${item.rfq_volume_30day}\n`;
      output += `  Conversion Volume (24h): ${item.conversion_volume_24hour}\n`;
      output += `  Conversion Volume (30d): ${item.conversion_volume_30day}\n`;
      output += '\n'; // Add a blank line for readability
    });
  } else {
    output += 'Unexpected response format: ' + JSON.stringify(data, null, 2) + '\n';
  }

  // Define the output file path
  const outputFilePath = path.join(__dirname, 'volume-summary.txt');

  // Write the output to the file
  fs.writeFile(outputFilePath, output, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Output written to volume-summary.txt');
    }
  });
})
.catch((error) => {
  console.log('Error:', error.message);
});
