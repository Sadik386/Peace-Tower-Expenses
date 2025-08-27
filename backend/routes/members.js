const express = require('express');
const router = express.Router();
const sheetsService = require('../services/mockSheetsService');

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await sheetsService.getMembers();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new member
router.post('/', async (req, res) => {
  try {
    const { flatNo, name, contact, email } = req.body;
    
    if (!flatNo || !name || !contact) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const member = { flatNo, name, contact, email };
    await sheetsService.addMember(member);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;