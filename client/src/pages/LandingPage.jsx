import React from 'react';
import { 
  TrendingUp, 
  BarChart2, 
  PieChart, 
  MessageSquare, 
  Archive, 
  DollarSign,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <BarChart2 className="h-6 w-6" />,
      title: "Report Generation",
      description: "Generate comprehensive financial reports with automated analysis and insights"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "AI-Powered Chatbot",
      description: "Get instant answers to your financial queries with our intelligent assistant"
    },
    {
      icon: <Archive className="h-6 w-6" />,
      title: "Expense Tracking",
      description: "Track and categorize your expenses automatically with smart categorization"
    },
    {
      icon: <PieChart className="h-6 w-6" />,
      title: "Financial Analysis",
      description: "Deep dive into your financial data with advanced analytics and visualizations"
    }
  ];

  const services = [
    {
      title: "Sentiment Analysis",
      description: "Understand market sentiment and make informed decisions",
      color: "bg-blue-500"
    },
    {
      title: "Balance Sheet Analysis",
      description: "Comprehensive analysis of your financial position",
      color: "bg-purple-500"
    },
    {
      title: "Historical Price Analysis",
      description: "Track and analyze historical price trends",
      color: "bg-green-500"
    },
    {
      title: "Budget Insights",
      description: "Get personalized insights for better budgeting",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Next-Gen Financial Analytics
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Transform your financial decision-making with AI-powered insights, 
              real-time analysis, and intelligent portfolio management.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Get Started
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">$2B+</div>
            <div className="text-gray-600">Assets Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Features for Smart Finance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with financial expertise 
            to deliver the tools you need for success.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Comprehensive Financial Services
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to manage, analyze, and grow your financial portfolio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                <div className={`${service.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {service.description}
                </p>
                <button className="text-white flex items-center hover:text-blue-400 transition-colors">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-2">Ready to get started?</h2>
              <p className="text-blue-100">Join thousands of users making better financial decisions.</p>
            </div>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center">
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;