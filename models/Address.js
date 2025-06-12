const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
	Streetadd: { type: String, required: true },
	City: { type: String, required: true },
	State: { type: String, required: true },
	Zipcode: { type: String, required: true },
});

module.exports = mongoose.model("Address", addressSchema);
