const mongoose = require('mongoose');
const cartItemSchema = require('./CartItem');
const creditCardSchema = require('./CreditCard');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  cart: [cartItemSchema],
  creditCard: creditCardSchema, 
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: false,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
