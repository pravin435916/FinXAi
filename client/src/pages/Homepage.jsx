import React from 'react';
import { Newspaper } from 'lucide-react';
import Navbar from '../components/Navbar';
import MarketOverview from '../components/MarketOverview';

const HomePage = () => {
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
        {/* Real-time Market Overview */}
        <MarketOverview />

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