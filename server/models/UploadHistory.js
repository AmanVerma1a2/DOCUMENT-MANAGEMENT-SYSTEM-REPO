const mongoose = require('mongoose');

const UploadHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentName: { type: String, required: true },
  size: { type: Number },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UploadHistory', UploadHistorySchema);
