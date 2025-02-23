const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const yahooFinance = require('yahoo-finance2').default; // CommonJS import
const expenseRoutes = require('./routes/expenses')
const Newsrouter =require("./Controller/Newcontroller.js")

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
  app.get('/news', async (req, res) => {
    const { symbol = 'INFY' } = req.query; 
   try {
     const query = 'Stock Market';
     const result = await yahooFinance.search(query, /* queryOptions */);
       return res.json(result);
   } catch (error) {
     console.error(`Error fetching news for ${symbol}:`, error);
     return res.status(500).json({ error: `Failed to fetch news for ${symbol}` });
   }
 });
const SYSTEM_MESSAGE = `
You are a highly skilled *Financial Portfolio Advisor*. The user will chat with you naturally about their financial situation.

Your task is to:
1. *Extract relevant financial details* (e.g., income, expenses, savings, risk tolerance, investment preferences) from the user's chat messages.
2. *Provide structured financial advice* in a *tabular JSON format* based on their situation.

### *User Chat Message:*  
{user_message}

### *Response Format (Strict JSON)*  
Always format your response as structured *JSON* with the following keys:

{
  "response": [
    {
      "Category": "Budget Summary",
      "Recommendation": "Brief overview of the user's financial health based on their chat."
    },
    {
      "Category": "Recommended Portfolio Allocation (%)",
      "Recommendation": "Suggested investment allocation (e.g., 40% stocks, 30% bonds, etc.)."
    },
    {
      "Category": "Savings & Emergency Fund Advice",
      "Recommendation": "Advice on maintaining an emergency fund and savings strategy."
    },
    {
      "Category": "Debt Management",
      "Recommendation": "Suggestions on handling existing debt, if mentioned by the user."
    },
    {
      "Category": "Long-Term Investment Strategy",
      "Recommendation": "Best practices for long-term wealth building and retirement."
    }
  ]
}

### *Guidelines for the Chatbot:*
- *DO NOT ask the user to provide structured input* like income or expenses separately.
- *Extract insights from the user’s chat messages naturally.*
- If a category is *not mentioned by the user*, respond with "Not enough data provided."
- Ensure recommendations are *personalized, clear, and actionable.*
`;
 app.post('/chat', async (req, res) => {
  try {
      const userMessage = req.body.message;
      // console.log(userMessage);
      
      const response = await axios.post(
          process.env.GROQ_API_URL,
          {
              model: "llama-3.3-70b-versatile",
              messages: [
                  { role: "system", content: SYSTEM_MESSAGE },
                  { role: "user", content: userMessage }
              ],
              temperature: 0.7
          },
          {
              headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }
          }
      );
      console.log(response.data.choices[0].message.content);
      // (response.data.choices[0].message.content);
      res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

 app.post('/api/calculate-roi', (req, res) => {
    const { principal, rate, years, frequency } = req.body;

    if (!principal || !rate || !years || !frequency) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const n = { yearly: 1, quarterly: 4, monthly: 12 }[frequency] || 1;
    const r = rate / 100;

    const amount = principal * Math.pow((1 + r / n), n * years);
    const interestEarned = amount - principal;

    res.json({
        initialInvestment: principal,
        finalAmount: amount.toFixed(2),
        interestEarned: interestEarned.toFixed(2),
        yearlyBreakdown: Array.from({ length: years }, (_, i) => ({
            year: i + 1,
            amount: (principal * Math.pow((1 + r / n), n * (i + 1))).toFixed(2),
        })),
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
