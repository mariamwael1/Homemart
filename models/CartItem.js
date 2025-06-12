// models/CartItem.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  quantity: { type: Number, default: 1 },
  priceAtAddTime: Number
}, { _id: false });

module.exports = cartItemSchema;
