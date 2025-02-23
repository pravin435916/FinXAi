import React, { useEffect, useState } from 'react';
import { Clock, ExternalLink, Search } from 'lucide-react';

const FinanceNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const fetchNews = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setError('Please enter a search term');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await fetch(`http://localhost:3001/news/${encodeURIComponent(searchQuery)}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch news');
            }
            
            const data = await response.json();
            if (data.news) {
                setNews(data.news);
            } else {
                setNews([]);
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            setError(error.message || 'Failed to fetch news');
            setNews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setQuery(searchTerm);
        fetchNews(searchTerm);
    };

    const handleReadMore = (link) => {
        window.open(link, '_blank', 'noopener noreferrer');
    };

    const getThumbnailUrl = (thumbnailData) => {
        if (!thumbnailData?.resolutions?.length) return null;
        
        const originalImage = thumbnailData.resolutions.find(res => res.tag === 'original');
        if (originalImage) return originalImage.url;
        
        return thumbnailData.resolutions[0].url;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-white">Market News Search</h2>
                
                {/* Search Form */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for company or ticker symbol..."
                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                                     text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                                 transition-colors duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
                        {error}
                    </div>
                )}
            </div>
            
            {/* News Results */}
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    {news.length > 0 ? (
                        news.map((item) => (
                            <article 
                                key={item.uuid} 
                                className="flex gap-4 p-4 backdrop-blur-lg bg-gray-800/50 border border-gray-700 
                                         rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                                onClick={() => handleReadMore(item.link)}
                            >
                                {item.thumbnail && (
                                    <div className="flex-shrink-0">
                                        <img
                                            src={getThumbnailUrl(item.thumbnail)}
                                            alt={item.title}
                                            className="w-32 h-32 object-cover rounded-md"
                                            onError={(e) => {
                                                e.target.src = "/api/placeholder/140/140";
                                            }}
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded">
                                            {item.publisher}
                                        </span>
                                        <div className="flex items-center text-gray-400 text-sm">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {formatDate(item.providerPublishTime)}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {item.title}
                                    </h3>
                                    {item.relatedTickers && item.relatedTickers.length > 0 && (
                                        <div className="flex gap-2 mb-3">
                                            {item.relatedTickers.map((ticker) => (
                                                <span
                                                    key={ticker}
                                                    className="px-2 py-1 bg-gray-700/50 text-gray-300 text-sm rounded"
                                                >
                                                    ${ticker}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center text-blue-400 hover:text-blue-300">
                                        <span className="mr-1">Read more</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : query ? (
                        <div className="text-center py-8 text-gray-400">
                            No news articles found for "{query}".
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            Enter a company name or ticker symbol to search for news.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FinanceNews;