import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MarketOverview = () => {
  const [stockData, setStockData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const res = await fetch("http://localhost:3001/realtime");
        const data = await res.json();
        setStockData(data);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Error fetching stock data:", err);
      }
    };

    const interval = setInterval(fetchStockData, 2000);
    fetchStockData();

    return () => clearInterval(interval);
  }, []);

  if (!stockData) {
    return (
      <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl shadow-lg border border-gray-700 p-6 mb-8">
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-gray-400">Loading market data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl shadow-lg border border-gray-700 p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center text-white">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
          Market Overview
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button className="px-4 py-2 text-sm bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
            View All
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stockData).map(([symbol, details]) => (
          <div
            key={symbol}
            className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg border border-gray-700 
                     hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-white">{symbol}</h3>
                <p className="text-sm text-gray-400">{details.shortName}</p>
              </div>
              {details.regularMarketChangePercent >= 0 ? (
                <ArrowUpRight className="h-5 w-5 text-green-400" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="flex items-end justify-between mt-4">
              <span className="text-lg font-semibold text-white">
                ₹{details.regularMarketPrice.toFixed(2)}
              </span>
              <span className={`text-sm px-2 py-1 rounded-md ${
                details.regularMarketChangePercent >= 0
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {Math.abs(details.regularMarketChangePercent).toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;