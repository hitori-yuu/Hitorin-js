const mongoose = require('mongoose');

const guildsSchema = new mongoose.Schema({
	_id: { type: String, require: true },
	ownerID: { type: String },
	welcomeCh: { type: String, unique: true },
	globalBan: { type: Boolean, default: true },
});

const model = mongoose.model('Guilds', guildsSchema);

module.exports = model;