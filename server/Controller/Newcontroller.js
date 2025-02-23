const express = require('express');

const Newsrouter = express.Router();
const apiKey = 'e48dcc0411b440c290ff55decac16db4'; // Replace with your actual API key

Newsrouter.get('/stock-news', async (req, res) => {
    const apiUrl = 'https://newsapi.org/v2/top-headlines';

    const params = new URLSearchParams({
        apiKey: apiKey,
        q: 'stocks OR stock market OR finance OR Wall Street',
        category: 'business',
        country: 'us',
        language: 'en',
        pageSize: 10
    });

    const requestUrl = `${apiUrl}?${params.toString()}`;

    try {
        const response = await fetch(requestUrl); // Use built-in fetch()
        if (!response.ok) {
            return res.status(response.status).json({ error: `News API error: ${response.statusText}` });
        }

        const data = await response.json();
        return res.json({ articles: data.articles });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

Newsrouter.get('/trending-news', async (req, res) => {
    const apiUrl = 'https://newsapi.org/v2/top-headlines';

    const params = new URLSearchParams({
        apiKey: apiKey,
        q:"infosys",
        country: 'us',        // Get trending news from the US
        language: 'en',       // English language news
        sortBy: 'popularity', // Sort news by popularity (trending)
        pageSize: 10          // Fetch 10 trending articles
    });

    const requestUrl = `${apiUrl}?${params.toString()}`;

    try {
        const response = await fetch(requestUrl);
        if (!response.ok) {
            return res.status(response.status).json({ error: `News API error: ${response.statusText}` });
        }

        const data = await response.json();
        return res.json({ articles: data.articles });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = Newsrouter;
