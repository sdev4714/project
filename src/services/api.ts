const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
    
    const data = await this.handleResponse<{ token: string; user: any }>(response);
    localStorage.setItem('token', data.token);
    return data;
  }

  async signup(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await this.handleResponse<{ token: string; user: any }>(response);
    localStorage.setItem('token', data.token);
    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<{ user: any }>(response);
  }

  // Transaction endpoints
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(`${API_BASE_URL}/transactions?${queryParams}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<{ transactions: any[]; pagination: any }>(response);
  }

  async createTransaction(transaction: {
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    date?: string;
    notes?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(transaction)
    });
    return this.handleResponse<{ transaction: any }>(response);
  }

  async updateTransaction(id: string, transaction: Partial<{
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    date: string;
    notes: string;
  }>) {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(transaction)
    });
    return this.handleResponse<{ transaction: any }>(response);
  }

  async deleteTransaction(id: string) {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<{ message: string }>(response);
  }

  // Budget endpoints
  async getBudgets() {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<{ budgets: any[] }>(response);
  }

  async createBudget(budget: {
    category: string;
    limit: number;
    period: 'weekly' | 'monthly' | 'yearly';
    alertThreshold?: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(budget)
    });
    return this.handleResponse<{ budget: any }>(response);
  }

  async updateBudget(id: string, budget: Partial<{
    limit: number;
    alertThreshold: number;
    isActive: boolean;
  }>) {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(budget)
    });
    return this.handleResponse<{ budget: any }>(response);
  }

  async deleteBudget(id: string) {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<{ message: string }>(response);
  }

  // Dashboard endpoint
  async getDashboardData() {
    const response = await fetch(`${API_BASE_URL}/users/dashboard`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<any>(response);
  }

  // User endpoints
  async updateProfile(profile: {
    name?: string;
    preferences?: {
      currency?: string;
      timezone?: string;
      theme?: string;
      notifications?: any;
    };
  }) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profile)
    });
    return this.handleResponse<{ user: any }>(response);
  }

  async deleteAccount() {
    const response = await fetch(`${API_BASE_URL}/users/account`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<{ message: string }>(response);
  }

  logout() {
    localStorage.removeItem('token');
  }
}

export const apiService = new ApiService();