import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';
import yahooFinance from 'yahoo-finance2';
dotenv.config();
const app = express();
const PORT = 3001;
app.use(express.json());
app.set(urlencoded({ extended: true }));

app.use(cors());
app.get('/', (req, res) => {
  res.send("Hello World");
});


app.get('/realtime', async (req, res) => {
  try {
      const symbols = ['^NSEI','^BSESN','NIFTYMIDCAP150.NS', '^NSEBANK']; // Array of symbols
      const results = {};

      // Use Promise.all to fetch data concurrently for all symbols
      const promises = symbols.map(symbol => yahooFinance.quote(symbol));
      const quotes = await Promise.all(promises);

      // Store the results in an object with symbol as key
      symbols.forEach((symbol, index) => {
          results[symbol] = quotes[index];
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



    // Backend API Routes (Node.js/Express)
