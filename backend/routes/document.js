const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, TXT, and image files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// Upload document
router.post('/upload', authMiddleware, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, sharedWith } = req.body;

    const document = new Document({
      title: title || req.file.originalname,
      description,
      uploadedBy: req.user.userId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      sharedWith: sharedWith ? JSON.parse(sharedWith) : []
    });

    await document.save();

    res.status(201).json({
      message: 'Document uploaded successfully',
      document
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all user documents
router.get('/my-documents', authMiddleware, async (req, res) => {
  try {
    const documents = await Document.find({
      $or: [
        { uploadedBy: req.user.userId },
        { 'sharedWith.user': req.user.userId }
      ]
    })
    .populate('uploadedBy', 'email role')
    .populate('sharedWith.user', 'email role')
    .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get document by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'email role')
      .populate('sharedWith.user', 'email role')
      .populate('signatures.user', 'email role');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user has access
    const hasAccess = 
      document.uploadedBy._id.toString() === req.user.userId ||
      document.sharedWith.some(s => s.user._id.toString() === req.user.userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Download document
router.get('/:id/download', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user has access
    const hasAccess = 
      document.uploadedBy.toString() === req.user.userId ||
      document.sharedWith.some(s => s.user.toString() === req.user.userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.download(document.filePath, document.fileName);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add signature to document
router.post('/:id/sign', authMiddleware, async (req, res) => {
  try {
    const { signatureImage } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user has sign permission
    const sharedUser = document.sharedWith.find(
      s => s.user.toString() === req.user.userId && s.permissions === 'sign'
    );

    const isOwner = document.uploadedBy.toString() === req.user.userId;

    if (!isOwner && !sharedUser) {
      return res.status(403).json({ message: 'No permission to sign this document' });
    }

    // Check if already signed
    const alreadySigned = document.signatures.some(
      s => s.user.toString() === req.user.userId
    );

    if (alreadySigned) {
      return res.status(400).json({ message: 'Already signed this document' });
    }

    // Add signature
    document.signatures.push({
      user: req.user.userId,
      signatureImage
    });

    await document.save();

    res.json({
      message: 'Document signed successfully',
      document
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update document status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Only owner can update status
    if (document.uploadedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only owner can update status' });
    }

    document.status = status;
    await document.save();

    res.json({
      message: 'Document status updated',
      document
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete document
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Only owner can delete
    if (document.uploadedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only owner can delete document' });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Serve document for preview
router.get('/:id/preview', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user has access
    const hasAccess = 
      document.uploadedBy.toString() === req.user.userId ||
      document.sharedWith.some(s => s.user.toString() === req.user.userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.sendFile(document.filePath);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;