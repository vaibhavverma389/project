// backend/routes/qr.js

import express from 'express';
import upload from '../utils/cloudinaryUpload.js';
import QR from '../models/qrcode.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = express.Router();

// Upload QR Code & Assign Coordinator
router.post('/upload', adminAuth, upload.single('qrcode'), async (req, res) => {
  const { qrid, coadmin } = req.body;

  if (!req.file || !qrid || !coadmin) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const qr = new QR({
      qrImage: req.file.path,
      qrId: qrid,
      assignedTo: coadmin
    });

    await qr.save();

    res.json({ success: true, message: '✅ QR uploaded & assigned successfully' });
  } catch (err) {
    console.error('QR upload error:', err);
    res.status(500).json({ success: false, message: '❌ Server error during upload' });
  }
});

// Optional: Get all uploaded QR codes
router.get('/', adminAuth, async (req, res) => {
  try {
    const qrList = await QR.find().populate('assignedTo', 'name email');
    res.json({ success: true, qrList });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch QR codes' });
  }
});

export default router;
