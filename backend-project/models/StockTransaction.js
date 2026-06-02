const mongoose = require('mongoose');

const stockTransactionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  transactionDate: { type: Date, required: true, default: Date.now },
  quantityMoved: { type: Number, required: true },
  transactionType: { type: String, required: true, enum: ['stock in', 'stock out'] },
}, { timestamps: true });

module.exports = mongoose.model('StockTransaction', stockTransactionSchema);
