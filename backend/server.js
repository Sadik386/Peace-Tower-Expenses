const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Use mock service for demo, replace with sheetsService for production
const sheetsService = require('./services/mockSheetsService');
const expensesRouter = require('./routes/expenses');
const membersRouter = require('./routes/members');
const paymentsRouter = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/expenses', expensesRouter);
app.use('/api/members', membersRouter);
app.use('/api/payments', paymentsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize Google Sheets and start server
async function startServer() {
  try {
    await sheetsService.initialize();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();