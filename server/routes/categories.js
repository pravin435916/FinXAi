// backend/routes/categories.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Category = require('../models/category.model');
const Expense = require('../models/expense.model');

// Validation middleware
const validateCategory = [
  body('label').trim().notEmpty().withMessage('Category name is required'),
  body('color').trim().notEmpty().withMessage('Color is required')
    .matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Valid color hex code is required'),
  body('budget').isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
];

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ label: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// Add new category
router.post('/categories', validateCategory, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Generate id from label
    const id = req.body.label.toLowerCase().replace(/\s+/g, '_');
    
    // Check for existing category with same id
    const existingCategory = await Category.findOne({ id });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const category = new Category({
      ...req.body,
      id
    });
    
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
});

// Update category
router.put('/categories/:id', validateCategory, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const category = await Category.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
});

// Delete category
router.delete('/categories/:id', async (req, res) => {
  try {
    // Check if category has expenses
    const expenseCount = await Expense.countDocuments({ category: req.params.id });
    if (expenseCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with existing expenses. Please reassign or delete related expenses first.' 
      });
    }

    const category = await Category.findOneAndDelete({ id: req.params.id });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
});

// Get category statistics
router.get('/categories/stats', async (req, res) => {
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

    // Get categories with their current spending and budget status
    const categoryStats = await Category.aggregate([
      {
        $lookup: {
          from: 'expenses',
          let: { categoryId: '$id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$category', '$$categoryId'] },
                    dateQuery.date ? { $gte: ['$date', dateQuery.date.$gte] } : true
                  ]
                }
              }
            }
          ],
          as: 'expenses'
        }
      },
      {
        $project: {
          _id: 0,
          id: 1,
          label: 1,
          budget: 1,
          color: 1,
          totalSpent: { $sum: '$expenses.amount' },
          transactionCount: { $size: '$expenses' },
          budgetUtilization: {
            $multiply: [
              { $divide: [{ $sum: '$expenses.amount' }, '$budget'] },
              100
            ]
          }
        }
      }
    ]);

    res.json(categoryStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category statistics', error: error.message });
  }
});

// Bulk update categories
router.put('/categories', async (req, res) => {
  try {
    const categories = req.body;
    if (!Array.isArray(categories)) {
      return res.status(400).json({ message: 'Expected an array of categories' });
    }

    // Validate each category
    const errors = categories.flatMap(cat => {
      if (!cat.id || !cat.label || !cat.color || typeof cat.budget !== 'number') {
        return [`Invalid data for category: ${cat.label || 'unnamed'}`];
      }
      return [];
    });

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Update all categories
    await Promise.all(categories.map(async (cat) => {
      await Category.findOneAndUpdate(
        { id: cat.id },
        { ...cat, updatedAt: Date.now() },
        { upsert: true, new: true }
      );
    }));

    const updatedCategories = await Category.find();
    res.json(updatedCategories);
  } catch (error) {
    res.status(500).json({ message: 'Error updating categories', error: error.message });
  }
});

module.exports = router;