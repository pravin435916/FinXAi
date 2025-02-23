import React from 'react';
import { 
  TrendingUp, 
  LineChart, 
  BarChart2, 
  PieChart, 
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Globe,
  Users
} from 'lucide-react';
import Navbar from '../components/Navbar';
import MarketOverview from '../components/MarketOverview';
import StockChart from '../components/chart/page';
import FinanceNews from '../components/FinancialNews';

const LandingPage = () => {
const features = [
    {
        icon: <Shield className="h-6 w-6" />,
        title: "AI-Powered Analysis",
        description: "Advanced algorithms analyze market trends and provide real-time insights for informed decision making"
    },
    {
        icon: <LineChart className="h-6 w-6" />,
        title: "Real-Time Tracking",
        description: "Monitor your investments with live updates and instant notifications on market movements"
    },
    {
        icon: <PieChart className="h-6 w-6" />,
        title: "Expense Tracking",
        description: "Keep track of your spending and manage your budget effectively with our expense tracking tools"
    },
    {
        icon: <Globe className="h-6 w-6" />,
        title: "Global Markets",
        description: "Access to international markets and diverse investment opportunities worldwide"
    }
];

  const stats = [
    { number: "10M+", label: "Active Users" },
    { number: "$50B+", label: "Assets Tracked" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden h-[65vh] flex items-center justify-center flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Next Generation Financial Advisor
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Transform your investment strategy with AI-powered insights, real-time market data, 
              and advanced portfolio management tools.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
                               font-semibold transition-all duration-200 flex items-center">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="px-8 py-3 border border-gray-600 hover:border-gray-500 text-white 
                               rounded-lg font-semibold transition-all duration-200">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 
                                     border border-gray-700 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Overview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <MarketOverview />
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FinanceNews />
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Powerful Features for Smart Investing
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with financial expertise to deliver 
            the tools you need for successful investing.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 
                                     border border-gray-700 hover:border-gray-600 
                                     transition-all duration-300">
              <div className="bg-blue-500/20 rounded-lg w-12 h-12 flex items-center 
                            justify-center text-blue-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

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

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Why Choose Our Platform?
              </h2>
              <ul className="space-y-4">
                {[
                  "Real-time market data and instant updates",
                  "Advanced AI-powered analysis and predictions",
                  "Comprehensive portfolio management tools",
                  "Expert insights and market research",
                  "Secure and reliable platform"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
                <Users className="h-48 w-48 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="backdrop-blur-lg bg-blue-600 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Investment Strategy?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who are already using our platform to make smarter investment decisions.
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold 
                           hover:bg-blue-50 transition-all duration-200 flex items-center mx-auto">
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>API</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Community</li>
                <li>Help Center</li>
                <li>Status</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>GitHub</li>
                <li>Discord</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            © 2025 FinTech Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;