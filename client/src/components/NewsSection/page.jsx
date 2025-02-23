import React, { useEffect, useState } from 'react';
import { Clock, ExternalLink } from 'lucide-react';

const FinanceNewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:3001/news');
        const data = await response.json();
        if (data.news) {
          setNews(data.news);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleReadMore = (link) => {
    window.open(link, '_blank', 'noopener noreferrer');
  };

  const getThumbnailUrl = (thumbnailData) => {
    if (!thumbnailData?.resolutions?.length) return null;
    
    // Try to get the original resolution first
    const originalImage = thumbnailData.resolutions.find(res => res.tag === 'original');
    if (originalImage) return originalImage.url;
    
    // Fallback to the first available resolution
    return thumbnailData.resolutions[0].url;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest Market News</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {news.length > 0 ? (
            news.map((item) => (
              <article 
                key={item.uuid} 
                className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
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
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                      {item.publisher}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(item.providerPublishTime)}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  {item.relatedTickers && item.relatedTickers.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {item.relatedTickers.map((ticker) => (
                        <span
                          key={ticker}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                        >
                          ${ticker}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center text-blue-600 hover:text-blue-800">
                    <span className="mr-1">Read more</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No news articles available at the moment.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinanceNewsSection;