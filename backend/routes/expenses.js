const express = require('express');
const router = express.Router();
const sheetsService = require('../services/mockSheetsService');

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await sheetsService.getExpenses();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new expense
router.post('/', async (req, res) => {
  try {
    const { title, amount, paidBy, splitAmong, category, date } = req.body;
    
    if (!title || !amount || !paidBy || !splitAmong) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const expense = {
      title,
      amount: parseFloat(amount),
      paidBy,
      splitAmong: Array.isArray(splitAmong) ? splitAmong : [splitAmong],
      category: category || 'General',
      date: date || new Date().toISOString().split('T')[0]
    };

    const expenseId = await sheetsService.addExpense(expense);
    res.status(201).json({ expenseId, ...expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;