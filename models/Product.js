// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  category: String,
  stockQuantity: { type: Number, default: 0 },
    markets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Market"
    }
]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
