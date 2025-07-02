// backend/routes/qr.js
import express from 'express';
import QrCode from '../models/qrcode.js';
import { adminAuth } from '../middlewares/adminAuth.js';
import upload from '../utils/cloudinaryUpload.js';

const router = express.Router();

// ✅ Upload QR Code
router.post('/upload', adminAuth, upload.single('qrImage'), async (req, res) => {
  const { qrId, assignTo } = req.body;
  if (!qrId || !req.file?.path)
    return res.status(400).json({ error: 'QR ID and image required' });

  const exists = await QrCode.findOne({ qrId });
  if (exists) return res.status(400).json({ error: 'QR ID already exists' });

  const qr = await QrCode.create({
    qrId,
    imageUrl: req.file.path,
    uploadedBy: req.admin._id,
    assignedTo: assignTo || null
  });

  res.json({ success: true, qr });
});

// ✅ Get all QR codes (admin)
router.get('/admin', adminAuth, async (req, res) => {
  const qrs = await QrCode.find().populate('assignedTo uploadedBy', 'name email role');
  res.json(qrs);
});

// ✅ Public QR listing (ID + image only)
router.get('/', async (req, res) => {
  const qrs = await QrCode.find({}, { qrId: 1, imageUrl: 1 }).sort({ createdAt: -1 });
  res.json(qrs);
});

export default router;