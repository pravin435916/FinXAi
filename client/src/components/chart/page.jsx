import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const StockChart = () => {
  const [stock, setStock] = useState('AAPL');
  const [startDate, setStartDate] = useState('2025-02-10');
  const [endDate, setEndDate] = useState('2025-02-21');
  const [interval, setInterval] = useState('1d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const intervals = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"];

  const fetchStockData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams({
        symbol: stock,
        period1: startDate,
        period2: endDate,
        interval: interval
      });

    try {
      // Make request to your backend API endpoint
      const response = await fetch(`http://localhost:3000/search?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Failed to fetch stock data: ' + err.message);
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <form onSubmit={fetchStockData} className="mb-8 bg-gray-100 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Symbol
            </label>
            <input
              type="text"
              value={stock}
              onChange={(e) => setStock(e.target.value.toUpperCase())}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="AAPL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interval
            </label>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {intervals.map((int) => (
                <option key={int} value={int}>
                  {int}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Fetch Data'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {data && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">
            {data.meta.shortName} ({data.meta.symbol})
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.quotes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value) => [`$${value.toFixed(2)}`]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#2563eb"
                  name="Close Price"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke="#16a34a"
                  name="High"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  stroke="#dc2626"
                  name="Low"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockChart;