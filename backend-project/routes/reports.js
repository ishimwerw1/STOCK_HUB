const express = require('express');
const StockTransaction = require('../models/StockTransaction');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/daily', auth, async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const transactions = await StockTransaction.find({ transactionDate: { $gte: start, $lte: end } })
      .populate('product').populate('warehouse').sort({ transactionDate: -1 });

    const stockIn = transactions.filter(t => t.transactionType === 'stock in').reduce((s, t) => s + t.quantityMoved, 0);
    const stockOut = transactions.filter(t => t.transactionType === 'stock out').reduce((s, t) => s + t.quantityMoved, 0);
    const products = await Product.find();

    res.json({ transactions, stockIn, stockOut, availableStock: products.reduce((s, p) => s + p.quantityInStock, 0), products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/weekly', auth, async (req, res) => {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const start = new Date(now);
    start.setDate(now.getDate() - dayOfWeek);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const transactions = await StockTransaction.find({ transactionDate: { $gte: start, $lte: end } })
      .populate('product').populate('warehouse').sort({ transactionDate: -1 });

    const stockIn = transactions.filter(t => t.transactionType === 'stock in').reduce((s, t) => s + t.quantityMoved, 0);
    const stockOut = transactions.filter(t => t.transactionType === 'stock out').reduce((s, t) => s + t.quantityMoved, 0);
    const products = await Product.find();

    res.json({ transactions, stockIn, stockOut, availableStock: products.reduce((s, p) => s + p.quantityInStock, 0), products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/monthly', auth, async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const transactions = await StockTransaction.find({ transactionDate: { $gte: start, $lte: end } })
      .populate('product').populate('warehouse').sort({ transactionDate: -1 });

    const stockIn = transactions.filter(t => t.transactionType === 'stock in').reduce((s, t) => s + t.quantityMoved, 0);
    const stockOut = transactions.filter(t => t.transactionType === 'stock out').reduce((s, t) => s + t.quantityMoved, 0);
    const products = await Product.find();

    res.json({ transactions, stockIn, stockOut, availableStock: products.reduce((s, p) => s + p.quantityInStock, 0), products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
