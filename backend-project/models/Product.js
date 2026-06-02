const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productCode: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  category: { type: String, required: true },
  quantityInStock: { type: Number, required: true, min: 0 },
  unitPrice: { type: Number, required: true, min: 0 },
  supplierName: { type: String, required: true },
  dateReceived: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
