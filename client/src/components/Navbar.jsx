import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Menu className="h-6 w-6 text-gray-400 hover:text-gray-200 cursor-pointer" />
            <div className="ml-4 flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                FinX AI
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
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
      </div>
    </nav>
  );
};

export default Navbar;