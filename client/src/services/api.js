// frontend/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const expenseApi = {
  // Get all expenses with optional filters
  getExpenses: async (filters = {}) => {
    try {
      const response = await api.get('/expenses', { 
        params: {
          ...filters,
          // Ensure date format is consistent
          startDate: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
          endDate: filters.endDate ? new Date(filters.endDate).toISOString() : undefined
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add new expense
  addExpense: async (expenseData) => {
    try {
      const response = await api.post('/expenses', {
        ...expenseData,
        date: new Date(expenseData.date).toISOString()
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update expense
  updateExpense: async (id, expenseData) => {
    try {
      const response = await api.put(`/expenses/${id}`, {
        ...expenseData,
        date: new Date(expenseData.date).toISOString()
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete expense
  deleteExpense: async (id) => {
    try {
      const response = await api.delete(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get expense statistics
  getStats: async (period) => {
    try {
      const response = await api.get('/expenses/stats', { 
        params: { period } 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateCategories: async (categories) => {
    // Implement API call to update categories
    const response = await fetch('/categories', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categories),
    });
    return response.json();
  },
};