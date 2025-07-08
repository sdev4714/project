# FinanceFlow - Full-Stack Financial Management Application

A modern, full-featured financial management application built with React, Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication System**: Secure signup/login with JWT
- 📊 **Dashboard**: Visual overview of finances with charts
- 💸 **Transaction Management**: Add, edit, delete, and filter transactions
- 🎯 **Budget Tracking**: Set and monitor budget limits
- 🤖 **AI Assistant**: Smart financial insights and recommendations
- ⚙️ **Settings**: Customizable preferences and themes
- 📱 **Responsive Design**: Works on all devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- React Router for navigation
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- Express validation

## Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB (local or cloud)
- Git

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/financeflow
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Start the server**:
   ```bash
   npm run dev
   ```

### Database Setup

1. **Install MongoDB locally** or use MongoDB Atlas
2. **Create a database** named `financeflow`
3. **Update MONGODB_URI** in your `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - Get user transactions (with filtering)
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `GET /api/budgets` - Get user budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Users
- `GET /api/users/dashboard` - Get dashboard data
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

## Project Structure

```
financeflow/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   └── data/              # Mock data
├── backend/               # Backend source
│   ├── models/            # MongoDB models
│   ├── routes/            # Express routes
│   ├── middleware/        # Custom middleware
│   └── server.js          # Entry point
└── README.md
```

## Development

### Frontend Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
npm run dev          # Start with nodemon
npm start            # Start production server
npm test             # Run tests
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Environment Variables for Production
```env
# Backend
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com

# Frontend
VITE_API_URL=https://your-backend-domain.com/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@financeflow.com or create an issue on GitHub.