import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  PieChart, 
  Settings, 
  TrendingUp,
  Bot,
  Target
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: CreditCard, label: 'Transactions', path: '/transactions' },
    { icon: PieChart, label: 'Analytics', path: '/analytics' },
    { icon: Target, label: 'Budgets', path: '/budgets' },
    { icon: Bot, label: 'AI Assistant', path: '/ai-assistant' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold">FinanceFlow</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">Smart Money Management</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-2 mb-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-600">AI Insights</span>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          You're spending 15% less on dining this month. Keep it up!
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;