const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');
// const { default: Newsrouter } = require('./Controller/Newcontroller');
const Newsrouter =require("./Controller/Newcontroller.js")
const yahooFinance = require('yahoo-finance2').default; // CommonJS import

dotenv.config();
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Use express.urlencoded() properly
app.use(cors());

app.get('/', (req, res) => {
  res.send("Hello World");
});

app.get('/realtime', async (req, res) => {
  try {
    const symbols = ['^NSEI', '^BSESN', 'NIFTYMIDCAP150.NS', '^NSEBANK'];
    const results = {};

    // Fetch data concurrently
    const promises = symbols.map(symbol => yahooFinance.quote(symbol));
    const quotes = await Promise.all(promises);

    // Store results
    symbols.forEach((symbol, index) => {
      results[symbol] = quotes[index];
    });

    return res.json(results);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.get('/search', async (req, res) => {
    const { symbol, period1, period2, interval } = req.query;
    console.log(symbol, period1, period2, interval);
    try {
      const results = await yahooFinance.chart(symbol, {
        period1,
        period2,
        interval
      });
      return res.json(results);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return res.status(500).json({ error: 'Failed to fetch stock data' });
    }
  });
  app.get('/news', async (req, res) => {
    const { symbol = 'INFY' } = req.query; // Get symbol from query parameters, default to 'INFY' if not provided
   // const symbol='AAPL' // Remove this hardcoded symbol
   try {
     const query = 'GOO';
     const result = await yahooFinance.search(query, /* queryOptions */);
       return res.json(result);
   } catch (error) {
     console.error(`Error fetching news for ${symbol}:`, error);
     return res.status(500).json({ error: `Failed to fetch news for ${symbol}` });
   }
 });

//   app.use("/news",Newsrouter);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
