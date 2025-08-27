const express = require('express');
const router = express.Router();
const sheetsService = require('../services/mockSheetsService');

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await sheetsService.getPayments();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark payment as paid/unpaid
router.patch('/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;
    
    if (!['paid', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "paid" or "pending"' });
    }

    await sheetsService.markPayment(paymentId, status);
    res.json({ paymentId, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get balance summary (who owes whom)
router.get('/balance', async (req, res) => {
  try {
    const balance = await sheetsService.getBalance();
    res.json(balance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;