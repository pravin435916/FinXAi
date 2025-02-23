import React from 'react'
import StockChart from '../components/chart/page'

function StockAnalysis() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            {/* Stock Chart Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Advanced Stock Analysis
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Dive deep into market data with our comprehensive charting tools and technical analysis features.
                    </p>
                </div>
                <StockChart />
            </section>
        </div>
    )
}

export default StockAnalysis