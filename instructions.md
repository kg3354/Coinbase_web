# This is the instructions for Silver 8 Capital SWE Round 2 Take Home Assignment. Author: Kaiwen Guo. Email: kg3354@nyu.edu 

## I will list the updates in a daily mannar, such that it is easiler to trace. 

## I have designed a similar web application before, which could be seen in https://github.com/kg3354/Jail-Database. It uses Flask to host the server, and used PHPMyAdmin for the database. 


## Day 1, May 25 2024 
I first retrived the API from 1Password, and the API configuration for me is
```
passphrase: 0aeaqko06fge
secret: LPvA+3buf65E0eDgBe6cFCuSNXp5uv/jn/9d8gTLXgJIEkpBhI5ZBhcYFe1VmjyxR2+SBUHDJXPQId2oBuaAsA==
key: 01f1b83c19f7c29463da79a137e38f1d
docs: https://docs.cloud.coinbase.com/exchange/docs/sandbox
```

I tried to use existing Python librarys for coinbase, but i do not want to violate the requirement 'Coinbase’s API'
Thus, i navigated to 

https://docs.cdp.coinbase.com/exchange/reference/exchangerestapi_getproducts/
https://docs.cdp.coinbase.com/exchange/reference/exchangerestapi_getproductcandles/

### To setup the environment:
To create a new package.json file:
```
    npm init -y
```
To install axois:
```
    npm install axios
```

I then created 2 simple NodeJs applications, one corresponding to each. The are called get_all_know_trading_pairs.js and bit_now.js

### get_all_know_trading_pairs.js: 

Only the get all known trading pair requires API authentication. I currently wrote the scirpts into the code directly, will modify into a config file or ini file in the future. 
The get_all_know_trading_pairs.js will return an array of variables including account id, currency, balance, availablity, hold, trading enabled, and pending enabled.
The outputs by running the script is:
```
(base) guobuzai@10-18-239-243 Coinbase_Web % node get_all_know_trading_pairs.js
Account Information:
Account ID: 9028c2b2-eb07-4f19-af23-bf7a8f5296d7
Currency: BAT (BAT)
Balance: 0.0000000000000000
Available: 0
Hold: 0.0000000000000000
Trading Enabled: true
Pending Deposit: 0.0000000000000000
---
Account ID: 1ac6c93b-0fb4-403d-9f61-b4ae88d84926
Currency: BTC (BTC)
Balance: 0.0000000000000000
Available: 0
Hold: 0.0000000000000000
Trading Enabled: true
Pending Deposit: 0.0000000000000000
---
Account ID: 25768de7-bc80-4216-a99f-6715044232d5
Currency: ETH (ETH)
Balance: 0.0000000000000000
Available: 0
Hold: 0.0000000000000000
Trading Enabled: true
Pending Deposit: 0.0000000000000000
---
Account ID: baece3e3-a118-4df1-a66c-5cf3bec51d49
Currency: EUR (EUR)
Balance: 0.0000000000000000
Available: 0
Hold: 0.0000000000000000
Trading Enabled: true
Pending Deposit: 0.0000000000000000
---
Account ID: ba0d968a-41a8-41ae-b3a8-41d5725a3892
Currency: GBP (GBP)
Balance: 0.0000000000000000
Available: 0
Hold: 0.0000000000000000
Trading Enabled: true
Pending Deposit: 0.0000000000000000
---
Account ID: ea5ddbdc-bcc6-4330-b893-b6d1f93a69f7
Currency: LINK (LINK)
Balance: 0.0000000000000000
Available: 0
Hold: 0.0000000000000000
Trading Enabled: true
Pending Deposit: 0.0000000000000000
---
Account ID: c2195bb8-a705-4335-84b4-b0398f9c0570
Currency: USD (USD)
Balance: 0.0000000000000000
Available: 0
Hold: 0.0000000000000000
Trading Enabled: true
Pending Deposit: 0.0000000000000000
---
Account ID: c480056b-bdfa-4b9f-bade-fbefbc55cbdf
Currency: USDC (USDC)
Balance: 0.0000000000000000
Available: 0
Hold: 0.0000000000000000
Trading Enabled: true
Pending Deposit: 0.0000000000000000
---
Account ID: ebd6b21c-40cf-4821-be70-5cb5faaa12d6
Currency: USDT (USDT)
Balance: 0.0000000000000000
Available: 0
Hold: 0.0000000000000000
Trading Enabled: true
Pending Deposit: 0.0000000000000000
---

```

### bit_now.js

The bit_now.js is then a calling the getproductcandles api and retriving the bitcoin price within a time range identified by the user. User needs to specify the start time, end time, and granularity. Many error checking was implemented, such as checking the format of user input, and adjust the granularity to match the required values: [60, 300, 900, 3600, 21600, 86400]. The default for starting time is a day earlier than 'now', default end time is 'now', and default granularity is 3600(1 hour).
By using all default values, the outputs are:
```
(base) guobuzai@10-18-239-243 Coinbase_Web % node bit_now.js
Enter the start date and time (YYYY-MM-DDTHH:mm:ss) or type "default" for 1 day earlier: default
Enter the end date and time (YYYY-MM-DDTHH:mm:ss) or type "now" for the current time: now
Enter the granularity in seconds (default is 3600): 3600
Fetching data from 2024-05-24T20:34:56Z to 2024-05-25T20:34:58Z with granularity 3600 seconds...
[
  {
    'Date and Time': '5/25/2024, 4:00:00 PM',
    'Lowest Price (USD)': '$69067.86',
    'Highest Price (USD)': '$69220.84',
    'Opening Price (USD)': '$69146.93',
    'Closing Price (USD)': '$69103.68',
    'Trading Volume': '44.2722 BTC'
  },
  {
    'Date and Time': '5/25/2024, 3:00:00 PM',
    'Lowest Price (USD)': '$69101.64',
    'Highest Price (USD)': '$69260.51',
    'Opening Price (USD)': '$69198.27',
    'Closing Price (USD)': '$69146.92',
    'Trading Volume': '68.4709 BTC'
  },
  {
    'Date and Time': '5/25/2024, 2:00:00 PM',
    'Lowest Price (USD)': '$69048.47',
    'Highest Price (USD)': '$69236.06',
    'Opening Price (USD)': '$69056.32',
    'Closing Price (USD)': '$69198.27',
    'Trading Volume': '101.7339 BTC'
  },
  {
    'Date and Time': '5/25/2024, 1:00:00 PM',
    'Lowest Price (USD)': '$68911.86',
    'Highest Price (USD)': '$69093.14',
    'Opening Price (USD)': '$68938.48',
    'Closing Price (USD)': '$69055.35',
    'Trading Volume': '63.2276 BTC'
  },
  {
    'Date and Time': '5/25/2024, 12:00:00 PM',
    'Lowest Price (USD)': '$68849.72',
    'Highest Price (USD)': '$69053.99',
    'Opening Price (USD)': '$68937.55',
    'Closing Price (USD)': '$68938.48',
    'Trading Volume': '121.5922 BTC'
  },
  {
    'Date and Time': '5/25/2024, 11:00:00 AM',
    'Lowest Price (USD)': '$68841.52',
    'Highest Price (USD)': '$69203.37',
    'Opening Price (USD)': '$69015.89',
    'Closing Price (USD)': '$68937.55',
    'Trading Volume': '130.4668 BTC'
  },
  {
    'Date and Time': '5/25/2024, 10:00:00 AM',
    'Lowest Price (USD)': '$68927.10',
    'Highest Price (USD)': '$69087.06',
    'Opening Price (USD)': '$69023.83',
    'Closing Price (USD)': '$69015.38',
    'Trading Volume': '156.3055 BTC'
  },
  {
    'Date and Time': '5/25/2024, 9:00:00 AM',
    'Lowest Price (USD)': '$68878.62',
    'Highest Price (USD)': '$69235.75',
    'Opening Price (USD)': '$69110.35',
    'Closing Price (USD)': '$69023.83',
    'Trading Volume': '178.0134 BTC'
  },
  {
    'Date and Time': '5/25/2024, 8:00:00 AM',
    'Lowest Price (USD)': '$69013.75',
    'Highest Price (USD)': '$69297.32',
    'Opening Price (USD)': '$69093.92',
    'Closing Price (USD)': '$69115.27',
    'Trading Volume': '120.7703 BTC'
  },
  {
    'Date and Time': '5/25/2024, 7:00:00 AM',
    'Lowest Price (USD)': '$69087.29',
    'Highest Price (USD)': '$69605.03',
    'Opening Price (USD)': '$69369.70',
    'Closing Price (USD)': '$69093.63',
    'Trading Volume': '204.1125 BTC'
  },
  {
    'Date and Time': '5/25/2024, 6:00:00 AM',
    'Lowest Price (USD)': '$69002.04',
    'Highest Price (USD)': '$69454.07',
    'Opening Price (USD)': '$69075.24',
    'Closing Price (USD)': '$69369.70',
    'Trading Volume': '145.7753 BTC'
  },
  {
    'Date and Time': '5/25/2024, 5:00:00 AM',
    'Lowest Price (USD)': '$68833.10',
    'Highest Price (USD)': '$69140.49',
    'Opening Price (USD)': '$68867.58',
    'Closing Price (USD)': '$69080.69',
    'Trading Volume': '77.6684 BTC'
  },
  {
    'Date and Time': '5/25/2024, 4:00:00 AM',
    'Lowest Price (USD)': '$68723.64',
    'Highest Price (USD)': '$69050.00',
    'Opening Price (USD)': '$68738.75',
    'Closing Price (USD)': '$68867.57',
    'Trading Volume': '130.5912 BTC'
  },
  {
    'Date and Time': '5/25/2024, 3:00:00 AM',
    'Lowest Price (USD)': '$68615.11',
    'Highest Price (USD)': '$68796.39',
    'Opening Price (USD)': '$68638.23',
    'Closing Price (USD)': '$68738.75',
    'Trading Volume': '59.8174 BTC'
  },
  {
    'Date and Time': '5/25/2024, 2:00:00 AM',
    'Lowest Price (USD)': '$68587.22',
    'Highest Price (USD)': '$68731.07',
    'Opening Price (USD)': '$68696.08',
    'Closing Price (USD)': '$68639.08',
    'Trading Volume': '83.8710 BTC'
  },
  {
    'Date and Time': '5/25/2024, 1:00:00 AM',
    'Lowest Price (USD)': '$68680.63',
    'Highest Price (USD)': '$68790.14',
    'Opening Price (USD)': '$68750.49',
    'Closing Price (USD)': '$68696.08',
    'Trading Volume': '42.0502 BTC'
  },
  {
    'Date and Time': '5/25/2024, 12:00:00 AM',
    'Lowest Price (USD)': '$68660.74',
    'Highest Price (USD)': '$68809.89',
    'Opening Price (USD)': '$68733.19',
    'Closing Price (USD)': '$68750.41',
    'Trading Volume': '81.6989 BTC'
  },
  {
    'Date and Time': '5/24/2024, 11:00:00 PM',
    'Lowest Price (USD)': '$68635.84',
    'Highest Price (USD)': '$68891.10',
    'Opening Price (USD)': '$68800.00',
    'Closing Price (USD)': '$68733.19',
    'Trading Volume': '91.3976 BTC'
  },
  {
    'Date and Time': '5/24/2024, 10:00:00 PM',
    'Lowest Price (USD)': '$68585.06',
    'Highest Price (USD)': '$68816.50',
    'Opening Price (USD)': '$68598.34',
    'Closing Price (USD)': '$68800.00',
    'Trading Volume': '99.9624 BTC'
  },
  {
    'Date and Time': '5/24/2024, 9:00:00 PM',
    'Lowest Price (USD)': '$68525.12',
    'Highest Price (USD)': '$68707.96',
    'Opening Price (USD)': '$68525.13',
    'Closing Price (USD)': '$68598.63',
    'Trading Volume': '103.7157 BTC'
  },
  {
    'Date and Time': '5/24/2024, 8:00:00 PM',
    'Lowest Price (USD)': '$68487.44',
    'Highest Price (USD)': '$68674.99',
    'Opening Price (USD)': '$68545.52',
    'Closing Price (USD)': '$68525.13',
    'Trading Volume': '103.2338 BTC'
  },
  {
    'Date and Time': '5/24/2024, 7:00:00 PM',
    'Lowest Price (USD)': '$68506.52',
    'Highest Price (USD)': '$68776.69',
    'Opening Price (USD)': '$68776.69',
    'Closing Price (USD)': '$68547.80',
    'Trading Volume': '126.2111 BTC'
  },
  {
    'Date and Time': '5/24/2024, 6:00:00 PM',
    'Lowest Price (USD)': '$68662.80',
    'Highest Price (USD)': '$68871.88',
    'Opening Price (USD)': '$68867.58',
    'Closing Price (USD)': '$68776.68',
    'Trading Volume': '135.4972 BTC'
  },
  {
    'Date and Time': '5/24/2024, 5:00:00 PM',
    'Lowest Price (USD)': '$67800.00',
    'Highest Price (USD)': '$69013.83',
    'Opening Price (USD)': '$68833.74',
    'Closing Price (USD)': '$68868.15',
    'Trading Volume': '570.8575 BTC'
  }
]

```

Today's main goal is to know the two major api calls, and understand how to use then using NodeJs. 
The time used today is from Saturday, May 25, 2024 at 3:07 PM to Saturday, May 25, 2024 at 4:36 PM, a total of 1.5 Hours.

Today's work is pushed to github:
https://github.com/kg3354/Coinbase_web.git



## Day 2, May 26 2024 

I first created a directory named day1, and I moved all the day1's work (get_all_know_trading_pairs.js and bit_now.js) into day1 directory for consistency.

Today is the day before Momorials day, thus I did not spend much time on the project. My goal for today is to have the backend and frontend skeleton ready using the most simple manner. They still uses the same logic from bit_now.js, and their goal is to now be able to retrive Bitcoin price using web. 

I chose to use NodeJs Server and React frontend. I created 3 files, server_day2.js as the NodeJs Server, App.js to receive user input, and PriceChart.js to display the data. All the API calls was achieved in server_day2.js, the App.js sets up the basic structure of the user interface, and PriceChart.js is displaying the results of bitcoin price in a friendly manner. 

I first added the new packages for todays task and the react directory named day2. The naming is to match each days work. 

```
npm install express axios cors

npx create-react-app day2
cd day2
npm install axios chart.js react-chartjs-2
npm install bootstrap
npm install chartjs-adapter-date-fns

```


I now made it possible for the server_day2.js and App.js to talk to each other, but I am encountering many different kinds of problems regarding the PriceChart.js. I believe it is due to the formating of the returned data, but i am not certain and need more testing. I am by current work saved and will continue next time. 

The total of hour spend today is 1 hour, from 5:30 to 6:24, and todays work is pushed to github same repo. 

Nexttime, i need to fix the request error, build the asset page, and more UI design. 


