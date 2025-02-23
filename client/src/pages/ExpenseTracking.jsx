import React, { useState, useEffect } from 'react';
import { 
  PieChart, 
  BarChart, 
  Wallet, 
  Calendar,
  PlusCircle,
  Filter,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Trash2
} from 'lucide-react';
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from 'recharts';

import { expenseApi } from '../services/api';

const categories = [
  { id: 'food', label: 'Food & Dining', color: '#3B82F6', budget: 500 },
  { id: 'transport', label: 'Transportation', color: '#10B981', budget: 300 },
  { id: 'utilities', label: 'Utilities', color: '#F59E0B', budget: 400 },
  { id: 'shopping', label: 'Shopping', color: '#6366F1', budget: 600 },
  { id: 'entertainment', label: 'Entertainment', color: '#EC4899', budget: 200 },
  { id: 'healthcare', label: 'Healthcare', color: '#8B5CF6', budget: 300 }
];

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [stats, setStats] = useState({
    total: 0,
    avgDaily: 0,
    categoryTotals: {}
  });
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch expenses and stats when filters change
  useEffect(() => {
    fetchExpenses();
    fetchStats();
  }, [selectedCategory, selectedPeriod]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        period: selectedPeriod,
        // Add specific date range if needed
        startDate: selectedPeriod === 'custom' ? startDate : undefined,
        endDate: selectedPeriod === 'custom' ? endDate : undefined
      };
      const data = await expenseApi.getExpenses(filters);
      if (Array.isArray(data)) {
        setExpenses(data);
      } else {
        console.error('Unexpected data format:', data);
        setError('Invalid data format received');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch expenses');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Modify the fetchStats function
  const fetchStats = async () => {
    try {
      const data = await expenseApi.getStats(selectedPeriod);
      if (data && typeof data === 'object') {
        setStats({
          total: data.total || 0,
          avgDaily: data.avgDaily || 0,
          categoryTotals: data.categoryTotals || {}
        });
      } else {
        console.error('Unexpected stats format:', data);
        setError('Invalid statistics data format');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    }
  };
  
  // Modify the handleAddExpense function
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const expenseToAdd = {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        date: new Date(newExpense.date).toISOString()
      };
      await expenseApi.addExpense(expenseToAdd);
      setNewExpense({
        title: '',
        amount: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0]
      });
      await Promise.all([fetchExpenses(), fetchStats()]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
      console.error('Error adding expense:', err);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteExpense = async (id) => {
    try {
      setLoading(true);
      await expenseApi.deleteExpense(id);
      await fetchExpenses();
      await fetchStats();
    } catch (err) {
      setError('Failed to delete expense');
      console.error('Error deleting expense:', err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const pieChartData = categories.map(cat => ({
    name: cat.label,
    value: stats.categoryTotals?.[cat.id] || 0,
    color: cat.color
  }));

  const barChartData = categories.map(cat => ({
    name: cat.label,
    amount: stats.categoryTotals?.[cat.id] || 0
  }));

  return (
    <div className='bg-gray-900'>
    <div className="max-w-7xl bg-gray-900 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Expense Tracker</h1>
        <p className="text-gray-400">Monitor and analyze your spending patterns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Wallet className="h-6 w-6 text-blue-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <h3 className="text-gray-400 mb-2">Total Expenses</h3>
          <p className="text-2xl font-bold text-white">${stats.total?.toFixed(2) || '0.00'}</p>
        </div>

        <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500/20 p-3 rounded-lg">
              <ArrowDownRight className="h-6 w-6 text-green-400" />
            </div>
            <span className="text-sm text-gray-400">This Month</span>
          </div>
          <h3 className="text-gray-400 mb-2">Highest Category</h3>
          <p className="text-2xl font-bold text-white">
            {Object.entries(stats.categoryTotals || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
          </p>
        </div>

        <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-sm text-gray-400">Daily Avg</span>
          </div>
          <h3 className="text-gray-400 mb-2">Average Spending</h3>
          <p className="text-2xl font-bold text-white">
            ${stats.avgDaily?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <PlusCircle className="h-5 w-5 mr-2 text-blue-400" />
          Add New Expense
        </h2>
        <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Form fields remain the same */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={newExpense.title}
              onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                       text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Expense title"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                         text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                required
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                       text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                       text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div className="md:col-span-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                       transition-colors duration-200 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart */}
        <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-blue-400" />
            Expense Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-blue-400" />
            Category Breakdown
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Bar dataKey="amount" fill="#3B82F6" />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Expenses Table */}
      <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Filter className="h-5 w-5 mr-2 text-blue-400" />
            Recent Expenses
          </h2>
          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                       text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                       text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-4 px-6">Title</th>
                <th className="text-left py-4 px-6">Category</th>
                <th className="text-left py-4 px-6">Date</th>
                <th className="text-right py-4 px-6">Amount</th>
                <th className="text-right py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                  <td className="py-4 px-6 text-white">{expense.title}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-sm" 
                          style={{ 
                            backgroundColor: categories.find(cat => cat.id === expense.category)?.color + '20',
                            color: categories.find(cat => cat.id === expense.category)?.color 
                          }}>
                      {categories.find(cat => cat.id === expense.category)?.label}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right text-white font-medium">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-2"
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    No expenses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Budget Progress</h2>
          <div className="space-y-4">
            {categories.map((category) => {
              const spent = stats.categoryTotals?.[category.id] || 0;
              const percentage = (spent / category.budget) * 100;
              
              return (
                <div key={category.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">{category.label}</span>
                    <span className="text-white">${spent.toFixed(2)} / ${category.budget}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: category.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
            Monthly Overview
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={expenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Legend />
                <Bar dataKey="amount" name="Amount" fill="#3B82F6" />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ExpenseTracker;