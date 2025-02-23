import { useState, useEffect } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/solid"; // You'll need to install !

export default function Navbar() {
    const [stockData, setStockData] = useState(null);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
              const res = await fetch("http://localhost:3001/realtime");
              const data = await res.json();
              setStockData(data);
            } catch (err) {
              console.error("Error fetching stock data:", err);
            }
          };
            const interval=setInterval(fetchStockData, 2000);
            fetchStockData();
        
            return () => clearInterval(interval);
          }, []);

    if (!stockData) {
        return (
            <div className="bg-gray-900 p-4 text-center text-white">
                <div className="animate-pulse">Loading market data...</div>
            </div>
        );
    }

    return (
        <nav className="bg-gray-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex space-x-8">
                        {Object.entries(stockData).map(([symbol, details]) => (
                            <div
                                key={symbol}
                                className="hover:bg-gray-800 px-4 py-2 rounded-lg transition-all duration-200"
                            >
                                <div className="flex items-center space-x-3">
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-400">
                                            {details.shortName}
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg font-bold">
                                                ₹{details.regularMarketPrice.toFixed(2)}
                                            </span>
                                            <span
                                                className={`flex items-center text-sm ${
                                                    details.regularMarketChangePercent >= 0
                                                        ? "text-green-400"
                                                        : "text-red-400"
                                                }`}
                                            >
                                                {details.regularMarketChangePercent >= 0 ? (
                                                    <ArrowUpIcon className="h-4 w-4" />
                                                ) : (
                                                    <ArrowDownIcon className="h-4 w-4" />
                                                )}
                                                {Math.abs(details.regularMarketChangePercent).toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-sm text-gray-400">
                        Last updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>
        </nav>
    );
}
