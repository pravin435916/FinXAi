import React, { useState, useEffect } from 'react';
import {
  PieChart,
  BarChart,
  Wallet,
  Calendar,
  PlusCircle,
  Filter,
  TrendingUp,
  Settings,
  Plus,
  X,
  Edit2,
  Save,
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
import ExpenseAnalytics from './ExpenseAnalytics';
import MonthlyOverview from './MonthlyOverview';

const defaultCategories = [
  { id: 'food', label: 'Food & Dining', color: '#3B82F6', budget: 500 },
  { id: 'transport', label: 'Transportation', color: '#10B981', budget: 300 },
  { id: 'utilities', label: 'Utilities', color: '#F59E0B', budget: 400 }
];

const ExpenseTracker = () => {
  // Base states
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  // Category management states
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('expense-categories');
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
  });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    id: '',
    label: '',
    color: '#000000',
    budget: 0
  });

  // Stats and expense states
  const [stats, setStats] = useState({
    total: 0,
    avgDaily: 0,
    categoryTotals: {}
  });
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: categories[0]?.id || '',
    date: new Date().toISOString().split('T')[0]
  });

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expense-categories', JSON.stringify(categories));
  }, [categories]);

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
        period: selectedPeriod
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
        category: categories[0]?.id || '',
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
      await Promise.all([fetchExpenses(), fetchStats()]);
    } catch (err) {
      setError('Failed to delete expense');
      console.error('Error deleting expense:', err);
    } finally {
      setLoading(false);
    }
  };

  // Category management functions
  const handleAddCategory = () => {
    if (!newCategory.label) {
      setError('Category name is required');
      return;
    }
    
    const categoryId = newCategory.label.toLowerCase().replace(/\s+/g, '-');
    const newCategoryWithId = {
      ...newCategory,
      id: categoryId
    };
    
    setCategories(prev => [...prev, newCategoryWithId]);
    setNewCategory({
      id: '',
      label: '',
      color: '#000000',
      budget: 0
    });
    setShowCategoryModal(false);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.label) {
      setError('Category name is required');
      return;
    }

    setCategories(prev => 
      prev.map(cat => cat.id === editingCategory.id ? editingCategory : cat)
    );
    setEditingCategory(null);
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (categoryId) => {
    if (expenses.some(expense => expense.category === categoryId)) {
      setError('Cannot delete category with existing expenses');
      return;
    }
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
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

  // Category Modal Component
  const CategoryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={() => {
              setShowCategoryModal(false);
              setEditingCategory(null);
              setError(null);
            }}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={editingCategory ? editingCategory.label : newCategory.label}
              onChange={(e) => {
                const value = e.target.value;
                if (editingCategory) {
                  setEditingCategory(prev => ({...prev, label: value}));
                } else {
                  setNewCategory(prev => ({
                    ...prev,
                    label: value,
                    id: value.toLowerCase().replace(/\s+/g, '-')
                  }));
                }
              }}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                     text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Category name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Color
            </label>
            <input
              type="color"
              value={editingCategory ? editingCategory.color : newCategory.color}
              onChange={(e) => {
                const value = e.target.value;
                if (editingCategory) {
                  setEditingCategory(prev => ({...prev, color: value}));
                } else {
                  setNewCategory(prev => ({...prev, color: value}));
                }
              }}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Budget
            </label>
            <input
              type="number"
              value={editingCategory ? editingCategory.budget : newCategory.budget}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (editingCategory) {
                  setEditingCategory(prev => ({...prev, budget: value}));
                } else {
                  setNewCategory(prev => ({...prev, budget: value}));
                }
              }}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                     text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          <button
            onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                   transition-colors duration-200"
          >
            {editingCategory ? 'Update Category' : 'Add Category'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900">
      <div className="max-w-7xl bg-gray-900 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {showCategoryModal && <CategoryModal />}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Expense Tracker</h1>
          <button
            onClick={() => {
              setShowCategoryModal(true);
              setEditingCategory(null);
              setNewCategory({
                id: '',
                label: '',
                color: '#000000',
                budget: 0
              });
            }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                   transition-colors duration-200 flex items-center"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Categories
          </button>
        </div>

        {/* Category List Section */}
        <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <div
                key={category.id}
                className="p-4 bg-gray-700/30 rounded-lg border border-gray-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-white font-medium">{category.label}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setShowCategoryModal(true);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-gray-400">
                  Budget: ${category.budget.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
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
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
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
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
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
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
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
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
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
          {/* <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 border border-gray-700">
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
          </div> */}
          <MonthlyOverview expenses={expenses} />
        </div>
      </div>
         {/* AI Chat Section */}
         <div className="mb-8">
          <ExpenseAnalytics
            expenses={expenses}
            stats={stats}
            categories={categories}
          />
        </div>
    </div>
  );
};

export default ExpenseTracker;