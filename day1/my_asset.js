const axios = require('axios');
const crypto = require('crypto');

const apiSecret = 'LPvA+3buf65E0eDgBe6cFCuSNXp5uv/jn/9d8gTLXgJIEkpBhI5ZBhcYFe1VmjyxR2+SBUHDJXPQId2oBuaAsA==';
const apiKey = '01f1b83c19f7c29463da79a137e38f1d';
const passphrase = '0aeaqko06fge';

const timestamp = Date.now() / 1000; // Timestamp in seconds
const requestPath = '/accounts'; // Change to your endpoint
const method = 'GET';
const body = ''; // Change based on request.  The body of an HTTP request is where you send data to the server in the case of POST, PUT, or PATCH requests. It's typically formatted as a JSON string.

const what = timestamp + method + requestPath + body;
const key = Buffer.from(apiSecret, 'base64');
const hmac = crypto.createHmac('sha256', key);
const sign = hmac.update(what).digest('base64');

let config = {
    method: method,
    url: `https://api-public.sandbox.pro.coinbase.com${requestPath}`,
    headers: {
        'CB-ACCESS-KEY': apiKey,
        'CB-ACCESS-SIGN': sign,
        'CB-ACCESS-TIMESTAMP': timestamp.toString(),
        'CB-ACCESS-PASSPHRASE': passphrase,
        'Content-Type': 'application/json'
    }
};

axios.request(config)
.then((response) => {
    console.log("Account Information:");
    response.data.forEach(account => {
        console.log(`Account ID: ${account.id}`);
        console.log(`Currency: ${account.display_name} (${account.currency})`);
        console.log(`Balance: ${account.balance}`);
        console.log(`Available: ${account.available}`);
        console.log(`Hold: ${account.hold}`);
        console.log(`Trading Enabled: ${account.trading_enabled}`);
        console.log(`Pending Deposit: ${account.pending_deposit}`);
        console.log('---'); // Separator for readability
    });
})
.catch((error) => {
    console.log(error);
});
