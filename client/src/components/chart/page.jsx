import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, Search, TrendingUp } from 'lucide-react';

const StockChart = () => {
  const [stock, setStock] = useState('AAPL');
  const [startDate, setStartDate] = useState('2025-02-10');
  const [endDate, setEndDate] = useState('2025-02-21');
  const [interval, setInterval] = useState('1d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const intervals = [
    { value: "1d", label: "1 Day" },
    { value: "5d", label: "5 Days" },
    { value: "1mo", label: "1 Month" },
    { value: "3mo", label: "3 Months" },
    { value: "6mo", label: "6 Months" },
    { value: "1y", label: "1 Year" },
    { value: "2y", label: "2 Years" },
    { value: "5y", label: "5 Years" },
    { value: "max", label: "Max" }
  ];

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
      const response = await fetch(`http://localhost:3001/search?${queryParams}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Failed to fetch stock data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" max-w-7xl mx-auto backdrop-blur-lg bg-gray-800/50 rounded-xl shadow-lg border border-gray-700 p-6">
      <div className="flex items-center mb-6">
        <TrendingUp className="h-6 w-6 text-blue-400 mr-3" />
        <h2 className="text-xl font-semibold text-white">Stock Price Analysis</h2>
      </div>

      <form onSubmit={fetchStockData} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Stock Symbol Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stock Symbol
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={stock}
                onChange={(e) => setStock(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent"
                placeholder="AAPL"
              />
            </div>
          </div>

          {/* Start Date Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                         text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent"
              />
            </div>
          </div>

          {/* End Date Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                         text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent"
              />
            </div>
          </div>

          {/* Interval Select */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Interval
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                         text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent appearance-none"
              >
                {intervals.map((int) => (
                  <option key={int.value} value={int.value} className="bg-gray-800">
                    {int.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                       transition-colors duration-200 flex items-center justify-center
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading...
                </div>
              ) : (
                'Fetch Data'
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {data && (
        <div className="bg-gray-700/30 backdrop-blur-sm p-6 rounded-lg border border-gray-600">
          <h2 className="text-xl font-bold mb-6 text-white flex items-center">
            {data.meta.shortName} 
            <span className="text-gray-400 text-base ml-2">({data.meta.symbol})</span>
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.quotes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  stroke="#9CA3AF"
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  stroke="#9CA3AF"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value) => [`$${value.toFixed(2)}`]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#3B82F6"
                  name="Close Price"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke="#10B981"
                  name="High"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  stroke="#EF4444"
                  name="Low"
                  dot={false}
                  strokeWidth={2}
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