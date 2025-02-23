const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const yahooFinance = require('yahoo-finance2').default; // CommonJS import
const expenseRoutes = require('./routes/expenses')
dotenv.config();
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Use express.urlencoded() properly
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.get('/', (req, res) => {
  res.send("Hello World");
});
app.use('/api', expenseRoutes);
app.get('/news/:query', async (req, res) => {
  const { query } = req.params; // Get query from params
  try {
    const result = await yahooFinance.search(query, /* queryOptions */);
    return res.json(result);
  } catch (error) {
    console.error(`Error fetching news for ${query}:`, error);
    return res.status(500).json({ error: `Failed to fetch news for ${query}` });
  }
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
