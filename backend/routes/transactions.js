import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get user transactions with filtering and pagination
// @access  Private
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      page = 1,
      limit = 20,
      type,
      category,
      startDate,
      endDate,
      search
    } = req.query;

    // Build filter object
    const filter = { user: req.user.userId };
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: skip + transactions.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/transactions
// @desc    Create new transaction
// @access  Private
router.post('/', auth, [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').trim().isLength({ min: 1, max: 50 }).withMessage('Category is required and must be less than 50 characters'),
  body('description').trim().isLength({ min: 1, max: 200 }).withMessage('Description is required and must be less than 200 characters'),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const transactionData = {
      ...req.body,
      user: req.user.userId,
      date: req.body.date ? new Date(req.body.date) : new Date()
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    // Update budget if it's an expense
    if (transaction.type === 'expense') {
      await updateBudgetSpent(req.user.userId, transaction.category, transaction.amount);
    }

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put('/:id', auth, [
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Category must be less than 50 characters'),
  body('description').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Description must be less than 200 characters'),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Store old values for budget update
    const oldAmount = transaction.amount;
    const oldCategory = transaction.category;
    const oldType = transaction.type;

    // Update transaction
    Object.assign(transaction, req.body);
    if (req.body.date) transaction.date = new Date(req.body.date);
    
    await transaction.save();

    // Update budgets if necessary
    if (oldType === 'expense') {
      await updateBudgetSpent(req.user.userId, oldCategory, -oldAmount);
    }
    if (transaction.type === 'expense') {
      await updateBudgetSpent(req.user.userId, transaction.category, transaction.amount);
    }

    res.json({
      message: 'Transaction updated successfully',
      transaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update budget if it was an expense
    if (transaction.type === 'expense') {
      await updateBudgetSpent(req.user.userId, transaction.category, -transaction.amount);
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to update budget spent amount
async function updateBudgetSpent(userId, category, amount) {
  try {
    const now = new Date();
    const budget = await Budget.findOne({
      user: userId,
      category,
      startDate: { $lte: now },
      endDate: { $gte: now },
      isActive: true
    });

    if (budget) {
      budget.spent = Math.max(0, budget.spent + amount);
      await budget.save();
    }
  } catch (error) {
    console.error('Update budget error:', error);
  }
}

export default router;