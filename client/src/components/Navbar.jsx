import React, { useState } from "react";
import { Bell, Search, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo & Menu Button */}
          <div className="flex items-center">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-gray-400 hover:text-gray-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo */}
            <span className="ml-4 text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              FinX AI
            </span>
          </div>

          {/* Center - Navigation Links (Hidden on Mobile) */}
          <div className="hidden lg:flex space-x-6 text-gray-300">
            <Link to="/stock-analysis" className="hover:text-white">Stock Analysis</Link>
            <Link to="/expense-tracker" className="hover:text-white">Expense Tracker</Link>
            <Link to="/roi-calculator" className="hover:text-white">ROI Calculator</Link>
          </div>

          {/* Right Side - Search & Notification */}
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search markets..."
                className="pl-10 pr-4 py-2 w-64 bg-gray-800 border border-gray-700 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-gray-300 placeholder-gray-500"
              />
            </div>
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              <Bell className="h-6 w-6 text-gray-400 hover:text-gray-200 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden bg-gray-800 p-4 space-y-2">
            <a href="#" className="block text-gray-300 hover:text-white">Stock Analysis</a>
            <a href="#" className="block text-gray-300 hover:text-white">ROI Calculator</a>
            <a href="#" className="block text-gray-300 hover:text-white">Expense Tracker</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
