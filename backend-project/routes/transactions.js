const express = require('express');
const StockTransaction = require('../models/StockTransaction');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { product, warehouse, transactionDate, quantityMoved, transactionType } = req.body;
    const prod = await Product.findById(product);
    if (!prod) return res.status(404).json({ message: 'Product not found' });

    if (transactionType === 'stock out' && prod.quantityInStock < quantityMoved) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const txn = await StockTransaction.create({ product, warehouse, transactionDate, quantityMoved, transactionType });

    if (transactionType === 'stock in') {
      prod.quantityInStock += quantityMoved;
    } else {
      prod.quantityInStock -= quantityMoved;
    }
    await prod.save();

    const populated = await StockTransaction.findById(txn._id).populate('product').populate('warehouse');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const transactions = await StockTransaction.find().populate('product').populate('warehouse').sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const txn = await StockTransaction.findById(req.params.id).populate('product').populate('warehouse');
    if (!txn) return res.status(404).json({ message: 'Transaction not found' });
    res.json(txn);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const txn = await StockTransaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('product').populate('warehouse');
    if (!txn) return res.status(404).json({ message: 'Transaction not found' });
    res.json(txn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const txn = await StockTransaction.findByIdAndDelete(req.params.id);
    if (!txn) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
