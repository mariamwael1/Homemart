const mongoose = require("mongoose");
const marketSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Carrefour"
  logo: String,
});

module.exports = mongoose.model("Market", marketSchema);
