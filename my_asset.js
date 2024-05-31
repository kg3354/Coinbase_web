const axios = require('axios');
const crypto = require('crypto');

const apiSecret = 'LPvA+3buf65E0eDgBe6cFCuSNXp5uv/jn/9d8gTLXgJIEkpBhI5ZBhcYFe1VmjyxR2+SBUHDJXPQId2oBuaAsA==';
const apiKey = '01f1b83c19f7c29463da79a137e38f1d';
const passphrase = '0aeaqko06fge';

const timestamp = Date.now() / 1000; // Timestamp in seconds
const requestPath = '/accounts';
const method = 'GET';
const body = '';

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
    const accountInfo = response.data.map(account => ({
        id: account.id,
        display_name: `${account.currency} Account`,
        currency: account.currency,
        balance: account.balance,
        available: account.available,
        hold: account.hold,
        trading_enabled: account.trading_enabled,
        pending_deposit: account.pending_deposit
    }));
    process.stdout.write(JSON.stringify(accountInfo)); // Send data to stdout
})
.catch((error) => {
    console.error('Error fetching sandbox assets:', error);
    process.exit(1); // Exit with an error code
});
