const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  warehouseCode: { type: String, required: true, unique: true },
  warehouseName: { type: String, required: true },
  warehouseLocation: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Warehouse', warehouseSchema);
