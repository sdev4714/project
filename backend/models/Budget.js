import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  limit: {
    type: Number,
    required: [true, 'Budget limit is required'],
    min: [0, 'Budget limit must be positive']
  },
  period: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, 'Spent amount cannot be negative']
  },
  alertThreshold: {
    type: Number,
    default: 80,
    min: [0, 'Alert threshold must be between 0 and 100'],
    max: [100, 'Alert threshold must be between 0 and 100']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one budget per category per period per user
budgetSchema.index({ user: 1, category: 1, startDate: 1, endDate: 1 }, { unique: true });

// Calculate percentage used
budgetSchema.virtual('percentageUsed').get(function() {
  return this.limit > 0 ? (this.spent / this.limit) * 100 : 0;
});

// Check if budget is exceeded
budgetSchema.virtual('isExceeded').get(function() {
  return this.spent > this.limit;
});

// Check if alert threshold is reached
budgetSchema.virtual('alertTriggered').get(function() {
  return this.percentageUsed >= this.alertThreshold;
});

budgetSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Budget', budgetSchema);