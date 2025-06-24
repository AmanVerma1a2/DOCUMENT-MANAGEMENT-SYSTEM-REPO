const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const authenticateToken = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    const ext = file.originalname.split('.').pop().toLowerCase();
    // Only allow images and pdf
    return {
      folder: 'documents',
      resource_type: imageExts.includes(ext) ? 'image' : 'raw',
      allowed_formats: [
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', // images
        'pdf' // pdf only
      ],
      public_id: file.originalname.split('.')[0]
    };
  }
});
const upload = multer({ storage: storage });

// Get all documents (protected)
router.get('/', authenticateToken, async (req, res) => {
  const docs = await Document.find();
  res.json(docs);
});

// Upload a document (protected)
router.post('/upload', authenticateToken, (req, res, next) => {
  upload.single('file')(req, res, async function (err) {
    if (err) {
      console.error('Multer/Cloudinary error:', err);
      return res.status(400).json({ message: 'Upload failed', error: err.message || err.toString() });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Debug: log the file object
    console.log('Uploaded file:', req.file);
    console.log('Request body:', req.body);
    try {
      const doc = new Document({
        name: req.file.originalname,
        url: req.file.url || req.file.path || '', // fallback to path if url missing
        size: req.file.size,
        uploadedBy: req.user.id,
      });
      await doc.save();
      res.json(doc);
    } catch (e) {
      console.error('DB save error:', e);
      res.status(500).json({ message: 'Failed to save document', error: e.message || e.toString() });
    }
  });
});

// Delete a document (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    // Also delete from Cloudinary
    if (doc.url) {
      // Extract public_id from Cloudinary URL
      const publicId = doc.url.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`documents/${publicId}`);
      } catch (e) {
        // Ignore Cloudinary errors, still delete from DB
      }
    }
    res.json({ message: 'Document deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting document' });
  }
});

module.exports = router;