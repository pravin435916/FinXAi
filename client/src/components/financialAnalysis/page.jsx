import  { useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const StockAnalysis = () => {
    const [ticker, setTicker] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const componentRef = useRef();

    const fetchAnalysis = async () => {
        if (!ticker.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://127.0.0.1:8001/stock-info/?ticker=${ticker}`);
            let data = response.data;
            data.analysis = JSON.parse(data.analysis.replace(/```json|```/g, "")); // Parse JSON from string
            setResult(data);
        } catch (err) {
            setError("Failed to fetch data. Please check the API.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
            <h2 className="text-2xl font-bold mb-4">Stock Financial Analysis</h2>
            <div className="flex space-x-2 mb-4">
                <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    placeholder="Enter Ticker (e.g., AAPL)"
                    className="p-2 border border-gray-600 rounded bg-gray-800 text-white flex-1"
                />
                <button
                    onClick={fetchAnalysis}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? "Analyzing..." : "Analyze"}
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {result && (
                <div ref={componentRef} className="mt-6 p-6 bg-gray-800 rounded-lg shadow w-full max-w-2xl">
                    <h3 className="text-lg font-semibold">Stock: <span className="text-blue-400">{result.ticker}</span></h3>
                    <h4 className="mt-4 font-semibold text-yellow-400">Investment Thesis</h4>
                    <p className="text-gray-300">{result.analysis.investment_thesis.stock_price_analysis.analysis}</p>

                    <h4 className="mt-4 font-semibold text-yellow-400">Analyst Recommendations</h4>
                    <p className="text-gray-300">{result.analysis.investment_thesis.analyst_recommendations.analysis}</p>

                    <h4 className="mt-4 font-semibold text-yellow-400">Stock Fundamentals</h4>
                    <p className="text-gray-300">{result.analysis.investment_thesis.stock_fundamentals.analysis}</p>
                </div>
            )}

            {result && (
                <button
                    onClick={handlePrint}
                    className="mt-4 bg-green-600 text-white p-2 rounded hover:bg-green-700"
                >
                    Download as PDF
                </button>
            )}
        </div>
    );
};

export default StockAnalysis;