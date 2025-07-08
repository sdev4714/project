import express from 'express';
import { body, validationResult } from 'express-validator';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/budgets
// @desc    Get user budgets
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({ budgets });
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/budgets
// @desc    Create new budget
// @access  Private
router.post('/', auth, [
  body('category').trim().isLength({ min: 1, max: 50 }).withMessage('Category is required and must be less than 50 characters'),
  body('limit').isFloat({ min: 0 }).withMessage('Budget limit must be a positive number'),
  body('period').isIn(['weekly', 'monthly', 'yearly']).withMessage('Period must be weekly, monthly, or yearly'),
  body('alertThreshold').optional().isFloat({ min: 0, max: 100 }).withMessage('Alert threshold must be between 0 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { category, limit, period, alertThreshold = 80 } = req.body;

    // Calculate start and end dates based on period
    const now = new Date();
    let startDate, endDate;

    switch (period) {
      case 'weekly':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
    }

    // Check if budget already exists for this period
    const existingBudget = await Budget.findOne({
      user: req.user.userId,
      category,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
      isActive: true
    });

    if (existingBudget) {
      return res.status(400).json({ 
        message: 'Budget already exists for this category and period' 
      });
    }

    // Calculate current spent amount
    const spent = await calculateSpentAmount(req.user.userId, category, startDate, endDate);

    const budget = new Budget({
      user: req.user.userId,
      category,
      limit,
      period,
      startDate,
      endDate,
      spent,
      alertThreshold
    });

    await budget.save();

    res.status(201).json({
      message: 'Budget created successfully',
      budget
    });
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/budgets/:id
// @desc    Update budget
// @access  Private
router.put('/:id', auth, [
  body('limit').optional().isFloat({ min: 0 }).withMessage('Budget limit must be a positive number'),
  body('alertThreshold').optional().isFloat({ min: 0, max: 100 }).withMessage('Alert threshold must be between 0 and 100'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Update budget
    Object.assign(budget, req.body);
    await budget.save();

    res.json({
      message: 'Budget updated successfully',
      budget
    });
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/budgets/:id
// @desc    Delete budget
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await Budget.findByIdAndDelete(req.params.id);

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate spent amount for a category in a date range
async function calculateSpentAmount(userId, category, startDate, endDate) {
  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          category,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    return result.length > 0 ? result[0].total : 0;
  } catch (error) {
    console.error('Calculate spent amount error:', error);
    return 0;
  }
}

export default router;