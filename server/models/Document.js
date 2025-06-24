const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  name: String,
  url: String,
  size: Number, // in bytes
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', DocumentSchema);