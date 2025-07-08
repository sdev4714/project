import { Transaction, Budget, Category, DashboardData } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Food & Dining', icon: 'UtensilsCrossed', color: '#F59E0B', type: 'expense' },
  { id: '2', name: 'Housing', icon: 'Home', color: '#EF4444', type: 'expense' },
  { id: '3', name: 'Transportation', icon: 'Car', color: '#8B5CF6', type: 'expense' },
  { id: '4', name: 'Entertainment', icon: 'Music', color: '#EC4899', type: 'expense' },
  { id: '5', name: 'Healthcare', icon: 'Heart', color: '#10B981', type: 'expense' },
  { id: '6', name: 'Shopping', icon: 'ShoppingBag', color: '#F97316', type: 'expense' },
  { id: '7', name: 'Utilities', icon: 'Zap', color: '#06B6D4', type: 'expense' },
  { id: '8', name: 'Education', icon: 'BookOpen', color: '#3B82F6', type: 'expense' },
  { id: '9', name: 'Salary', icon: 'DollarSign', color: '#059669', type: 'income' },
  { id: '10', name: 'Investment', icon: 'TrendingUp', color: '#7C3AED', type: 'income' },
  { id: '11', name: 'Freelance', icon: 'Briefcase', color: '#DC2626', type: 'income' },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 5000,
    date: '2024-01-15',
    type: 'income',
    category: 'Salary',
    description: 'Monthly salary',
    userId: '1'
  },
  {
    id: '2',
    amount: 1200,
    date: '2024-01-01',
    type: 'expense',
    category: 'Housing',
    description: 'Monthly rent',
    userId: '1'
  },
  {
    id: '3',
    amount: 45,
    date: '2024-01-10',
    type: 'expense',
    category: 'Food & Dining',
    description: 'Grocery shopping',
    userId: '1'
  },
  {
    id: '4',
    amount: 120,
    date: '2024-01-12',
    type: 'expense',
    category: 'Utilities',
    description: 'Electricity bill',
    userId: '1'
  },
  {
    id: '5',
    amount: 800,
    date: '2024-01-05',
    type: 'income',
    category: 'Freelance',
    description: 'Web development project',
    userId: '1'
  },
  {
    id: '6',
    amount: 250,
    date: '2024-01-08',
    type: 'expense',
    category: 'Shopping',
    description: 'Clothing purchase',
    userId: '1'
  },
  {
    id: '7',
    amount: 60,
    date: '2024-01-14',
    type: 'expense',
    category: 'Transportation',
    description: 'Gas for car',
    userId: '1'
  },
  {
    id: '8',
    amount: 90,
    date: '2024-01-16',
    type: 'expense',
    category: 'Entertainment',
    description: 'Movie tickets and dinner',
    userId: '1'
  }
];

export const mockBudgets: Budget[] = [
  { id: '1', category: 'Food & Dining', limit: 500, spent: 345, userId: '1' },
  { id: '2', category: 'Housing', limit: 1500, spent: 1200, userId: '1' },
  { id: '3', category: 'Transportation', limit: 300, spent: 180, userId: '1' },
  { id: '4', category: 'Entertainment', limit: 200, spent: 150, userId: '1' },
  { id: '5', category: 'Shopping', limit: 400, spent: 250, userId: '1' },
  { id: '6', category: 'Utilities', limit: 200, spent: 120, userId: '1' },
];

export const mockDashboardData: DashboardData = {
  totalIncome: 5800,
  totalExpenses: 2135,
  savings: 3665,
  monthlyData: [
    { month: 'Jan', income: 5800, expenses: 2135, savings: 3665 },
    { month: 'Feb', income: 5500, expenses: 2350, savings: 3150 },
    { month: 'Mar', income: 6200, expenses: 2100, savings: 4100 },
    { month: 'Apr', income: 5800, expenses: 2280, savings: 3520 },
    { month: 'May', income: 6100, expenses: 2450, savings: 3650 },
    { month: 'Jun', income: 5900, expenses: 2200, savings: 3700 },
  ],
  expensesByCategory: [
    { category: 'Housing', amount: 1200, percentage: 56.2, color: '#EF4444' },
    { category: 'Food & Dining', amount: 345, percentage: 16.2, color: '#F59E0B' },
    { category: 'Shopping', amount: 250, percentage: 11.7, color: '#F97316' },
    { category: 'Transportation', amount: 180, percentage: 8.4, color: '#8B5CF6' },
    { category: 'Entertainment', amount: 150, percentage: 7.0, color: '#EC4899' },
    { category: 'Utilities', amount: 120, percentage: 5.6, color: '#06B6D4' },
  ],
  budgets: mockBudgets
};