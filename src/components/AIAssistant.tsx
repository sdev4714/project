import React, { useState } from 'react';
import { Bot, Send, Lightbulb, TrendingUp, AlertTriangle, Target } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI financial assistant. I can help you with budgeting advice, expense analysis, and financial planning. What would you like to know?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const insights = [
    {
      icon: TrendingUp,
      title: 'Spending Trend',
      description: 'Your dining expenses decreased by 15% this month. Great job!',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      icon: AlertTriangle,
      title: 'Budget Alert',
      description: 'You\'re approaching your shopping budget limit (85% used)',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      icon: Target,
      title: 'Savings Goal',
      description: 'You\'re on track to reach your $5,000 savings goal by December',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      icon: Lightbulb,
      title: 'Money Tip',
      description: 'Consider setting up automatic transfers to boost your savings',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ];

  const quickActions = [
    'Analyze my spending patterns',
    'Create a budget plan',
    'Investment recommendations',
    'Debt payoff strategy',
    'Expense optimization tips'
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: getAIResponse(inputMessage),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputMessage('');
  };

  const getAIResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('spending') || lowerMessage.includes('expense')) {
      return "Based on your transaction history, I notice you've been spending more on dining out lately. Your food expenses increased by 20% compared to last month. Would you like some specific tips to reduce dining costs while still enjoying good food?";
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('plan')) {
      return "I'd be happy to help you create a budget plan! Based on your income of ₹5,800 and current expenses of ₹2,135, you have a good savings rate. I recommend the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Would you like me to create a detailed budget breakdown?";
    }
    
    if (lowerMessage.includes('investment') || lowerMessage.includes('invest')) {
      return "Given your current savings rate and financial stability, you might consider diversifying your portfolio. With your emergency fund covered, you could explore index funds or ETFs for long-term growth. However, always consult with a financial advisor for personalized investment advice.";
    }
    
    if (lowerMessage.includes('debt') || lowerMessage.includes('pay off')) {
      return "For debt payoff, I recommend the avalanche method: pay minimum amounts on all debts, then focus extra payments on the highest interest rate debt. This saves you the most money long-term. Would you like me to analyze your current debts and create a payoff timeline?";
    }
    
    return "I understand you're looking for financial guidance. Based on your current financial patterns, I can provide personalized advice on budgeting, saving, investing, or debt management. What specific area would you like to focus on?";
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">AI Assistant</h1>
        <p className="text-slate-600 dark:text-slate-400">Get personalized financial insights and advice</p>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                <insight.icon className={`w-5 h-5 ${insight.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">{insight.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Interface */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white">AI Financial Assistant</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Always here to help with your finances</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your finances..."
              className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;