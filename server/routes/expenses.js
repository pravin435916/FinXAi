// backend/routes/expenses.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Expense = require('../models/expense.model');

// Validation middleware
const validateExpense = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
//   body('date').isDate().withMessage('Valid date is required'),
];

// Get all expenses with optional filters
router.get('/expenses', async (req, res) => {
  try {
    const { category, period, startDate, endDate } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (period || (startDate && endDate)) {
      query.date = {};
      if (period === 'week') {
        query.date.$gte = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      } else if (period === 'month') {
        query.date.$gte = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      } else if (startDate && endDate) {
        query.date.$gte = new Date(startDate);
        query.date.$lte = new Date(endDate);
      }
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
});

// Add new expense
router.post('/expenses', validateExpense, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error creating expense', error: error.message });
  }
});

// Update expense
router.put('/expenses/:id', validateExpense, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error: error.message });
  }
});

// Delete expense
router.delete('/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error: error.message });
  }
});

// Get expense statistics
router.get('/expenses/stats', async (req, res) => {
    try {
      const { period } = req.query;
      let dateQuery = {};
  
      if (period === 'week') {
        dateQuery.date = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
      } else if (period === 'month') {
        dateQuery.date = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
      } else if (period === 'year') {
        dateQuery.date = { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) };
      }
  
      // First, get total and average
      const totalStats = await Expense.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
            avgDaily: { $avg: '$amount' }
          }
        }
      ]);
  
      // Then, get category totals
      const categoryStats = await Expense.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: '$category',
            amount: { $sum: '$amount' }
          }
        }
      ]);
  
      // Format the response
      const categoryTotals = categoryStats.reduce((acc, curr) => {
        acc[curr._id] = curr.amount;
        return acc;
      }, {});
  
      const stats = {
        total: totalStats[0]?.total || 0,
        avgDaily: totalStats[0]?.avgDaily || 0,
        categoryTotals
      };
  
      res.json(stats);
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ message: 'Error fetching statistics', error: error.message });
    }
  });

module.exports = router;