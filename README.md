# This is the instructions for Silver 8 Capital SWE Round 2 Take Home Assignment. 
## Author: Kaiwen Guo. Email: kg3354@nyu.edu 

## Please see instructions.md for detailed daily progress report. The testing plan is under TestingPlan.md



## To Start the Application

There are two ways of using my application. It could be used either via docker or through my github repo, https://github.com/kg3354/Coinbase_web


- `Using Docker`

To run the application using docker, simply start docker and then 
```
docker pull kg3354/s8oa:latest
docker run -p 3000:3000 -p 3001:3001 -e OPENAI_API_KEY=your_openai_api_key_here kg3354/s8oa:latest
```
You can set the OPENAI_API_KEY to your own. I also provided one via email for you to use. 

Then navigate to
```
http://localhost:3001
```

You can then view the application from http://localhost:3001, or using the ip address provided by the terminal!

- `Using Github`

To use my github repo, please execute the following instructions

```
git clone https://github.com/kg3354/Coinbase_web
cd Coinbase_Web
npm install
cd s8oa
npm install
pip install openai
```

Now have one terminal inside Coinbase_Web directory, run
```
export OPENAI_API_KEY=your_openai_api_key_here
node server.js
```

You can set the OPENAI_API_KEY to your own. I also provided one via email for you to use. 


Have another terminal inside s8oa directory, run
```
npm start
```


You can then view the application from http://localhost:3001, or using the ip address provided by the terminal!

## Key Implementations

I made sure all of the requirements are being designed, including

- API Integration
- Front End
- Testing  
- Environment

Additional features that I added includes:

- ChatGPT Chat Box
- Back End
- My Sandbox Asset Display
- Set Time To Now Button
- Add/Remove Currency Pair Functionality
- Quote Currency Image Display
- Time Lock on Start/End Time
- Multiple Access on the same network
- Automatic Trading Pair Fetch 

Did not include:
- Auto refresh, as I dont think is beneficial in my approach


## Conclusion

Once again, please see my instructions.md to view my daily progress. The testing plan is under TestingPlan.md
I provided one openai api key via email. Please let me know if it got deactivated
The github repo is https://github.com/kg3354/Coinbase_web
The docker image is kg3354/s8oa:latest

Looking forward to your review! This is Kaiwen Guo, kg3354@nyu.edu

