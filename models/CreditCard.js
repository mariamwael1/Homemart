// models/CartItem.js
const mongoose = require('mongoose');

const creditCardSchema = new mongoose.Schema({
  nameOnCard: String,
  cardNumber: String, // store last 4 digits or encrypted token (never raw)
  expiryMonth: String,
  expiryYear: String,
}, { _id: false });

module.exports = creditCardSchema; 