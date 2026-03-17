const express = require('express');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Deposit money (Mock)
router.post('/deposit', authMiddleware, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Mock transaction ID
    const transactionId = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    const transaction = new Transaction({
      user: req.user.userId,
      type: 'deposit',
      amount,
      paymentMethod: paymentMethod || 'stripe',
      transactionId,
      status: 'completed', // Mock: Auto complete
      description: `Deposit of ${amount} USD`
    });

    await transaction.save();

    res.status(201).json({
      message: 'Deposit successful',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Withdraw money (Mock)
router.post('/withdraw', authMiddleware, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Mock transaction ID
    const transactionId = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    const transaction = new Transaction({
      user: req.user.userId,
      type: 'withdraw',
      amount,
      paymentMethod: paymentMethod || 'bank_transfer',
      transactionId,
      status: 'completed', // Mock: Auto complete
      description: `Withdrawal of ${amount} USD`
    });

    await transaction.save();

    res.status(201).json({
      message: 'Withdrawal successful',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Transfer money to another user (Mock)
router.post('/transfer', authMiddleware, async (req, res) => {
  try {
    const { recipientId, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient required' });
    }

    if (recipientId === req.user.userId) {
      return res.status(400).json({ message: 'Cannot transfer to yourself' });
    }

    // Mock transaction ID
    const transactionId = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    const transaction = new Transaction({
      user: req.user.userId,
      type: 'transfer',
      amount,
      recipient: recipientId,
      transactionId,
      status: 'completed', // Mock: Auto complete
      description: `Transfer of ${amount} USD to user ${recipientId}`
    });

    await transaction.save();

    res.status(201).json({
      message: 'Transfer successful',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get transaction history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { user: req.user.userId },
        { recipient: req.user.userId }
      ]
    })
    .populate('user', 'email role')
    .populate('recipient', 'email role')
    .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get transaction by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('user', 'email role')
      .populate('recipient', 'email role');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user has access
    const hasAccess = 
      transaction.user._id.toString() === req.user.userId ||
      (transaction.recipient && transaction.recipient._id.toString() === req.user.userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;