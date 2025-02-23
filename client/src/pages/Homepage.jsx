import React from 'react';
import { TrendingUp, Newspaper, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const stockData = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '173.50', change: '+2.35', isPositive: true },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '202.64', change: '-1.23', isPositive: false },
    { symbol: 'MSFT', name: 'Microsoft', price: '415.32', change: '+3.21', isPositive: true },
    { symbol: 'AMZN', name: 'Amazon', price: '178.25', change: '+1.75', isPositive: true },
  ];

  const newsData = [
    {
      title: 'Federal Reserve Holds Interest Rates Steady',
      source: 'Financial Times',
      time: '2 hours ago'
    },
    {
      title: 'Tech Stocks Rally Amid Positive Earnings Reports',
      source: 'Reuters',
      time: '3 hours ago'
    },
    {
      title: 'Global Markets React to Economic Data',
      source: 'Bloomberg',
      time: '4 hours ago'
    },
    {
      title: 'Cryptocurrency Market Shows Signs of Recovery',
      source: 'CoinDesk',
      time: '5 hours ago'
    },
    {
      title: 'Oil Prices Surge on Supply Concerns',
      source: 'WSJ',
      time: '6 hours ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stock Market Overview */}
        <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl shadow-lg border border-gray-700 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center text-white">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
              Market Overview
            </h2>
            <button className="px-4 py-2 text-sm bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stockData.map((stock) => (
              <div key={stock.symbol} 
                   className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg border border-gray-700 
                            hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{stock.symbol}</h3>
                    <p className="text-sm text-gray-400">{stock.name}</p>
                  </div>
                  {stock.isPositive ? (
                    <ArrowUpRight className="h-5 w-5 text-green-400" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div className="flex items-end justify-between mt-4">
                  <span className="text-lg font-semibold text-white">${stock.price}</span>
                  <span className={`text-sm px-2 py-1 rounded-md ${
                    stock.isPositive 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {stock.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest News */}
        <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl shadow-lg border border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center text-white">
              <Newspaper className="h-5 w-5 mr-2 text-blue-400" />
              Latest Financial News
            </h2>
            <button className="px-4 py-2 text-sm bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {newsData.map((news, index) => (
              <div key={index} 
                   className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg border border-gray-700 
                            hover:border-gray-600 transition-all duration-300 cursor-pointer 
                            hover:shadow-lg hover:shadow-blue-900/20">
                <h3 className="font-semibold text-white mb-2">{news.title}</h3>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="text-blue-400">{news.source}</span>
                  <span className="mx-2">•</span>
                  <span>{news.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;