export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  notes?: string;
  userId: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  monthlyData: Array<{
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }>;
  expensesByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  budgets: Budget[];
}