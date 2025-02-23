import React, { useState } from "react";
import axios from "axios";

const StockSentiment = () => {
    const [ticker, setTicker] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSentiment = async () => {
        if (!ticker.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://127.0.0.1:8000/sentiment/${ticker}`);

            setResult(response.data); // Correctly setting response data
        } catch (err) {
            setError("Failed to fetch data. Please check the API.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Stock Sentiment Analysis</h2>
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    placeholder="Enter Ticker (e.g., ZOMATO)"
                    className="p-2 border rounded flex-1"
                />
                <button
                    onClick={fetchSentiment}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? "Analyzing..." : "Analyze"}
                </button>
            </div>

            {error && <p className="text-red-600 mt-4">{error}</p>}

            {result && (
                <div className="mt-6 p-4 bg-white rounded shadow">
                    <h3 className="text-lg font-semibold">
                        Sentiment: <span className="text-blue-700">{result.Sentiment}</span>
                    </h3>
                    <p className="mt-2 font-medium">{result.Conclusion}</p>

                    <ul className="mt-4 list-disc pl-5 space-y-2">
                        {result.Reasons?.map((reason, index) => (
                            <li key={index} className="text-gray-700">{reason}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default StockSentiment;
