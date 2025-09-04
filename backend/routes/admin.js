// backend/routes/admin.js

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';
import Coordinator from '../models/coordinater.js';
import Booking from '../models/booking.js';
import Student from '../models/student.js';
import upload from '../utils/cloudinaryUpload.js';
import QR from '../models/qrcode.js';


import { adminAuth } from '../middlewares/adminAuth.js';

const router = express.Router();

// ---------------------- ADMIN LOGIN ----------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ error: 'Admin not found' });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(400).json({ error: 'Invalid password' });

  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  res.json({ token });
});

// ---------------------- ADMIN CRUD ----------------------

// GET all admins
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const admins = await Admin.find().select('_id name email mobile');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// CREATE new admin
router.post('/create', adminAuth, async (req, res) => {
  const { name, email, password, mobile } = req.body;
  try {
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      mobile,
    });
    res.json({ message: 'Admin created', admin });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

// DELETE admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    if (req.admin.id === req.params.id) {
      return res.status(400).json({ error: '❌ You cannot delete your own account' });
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    await admin.deleteOne();
    res.json({ message: '✅ Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete admin' });
  }
});

// ---------------------- COORDINATOR ----------------------

// REGISTER new coordinator
router.post('/coordinator/register', adminAuth, async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'All fields required.' });

  try {
    const exists = await Coordinator.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Coordinator already exists.' });

    const hashed = await bcrypt.hash(password, 10);
    const coordinator = new Coordinator({ name, email, password: hashed });
    await coordinator.save();

    res.json({ success: true, message: 'Coordinator registered.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET all coordinators (for dropdown etc.)
router.get('/coordinators', adminAuth, async (req, res) => {
  try {
    const coordinators = await Coordinator.find().select('_id name email');
    res.json({ success: true, coordinators });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch coordinators' });
  }
});
router.post('/upload-qr', adminAuth, upload.single('qrcode'), async (req, res) => {
  const { qrid, coadmin } = req.body;

  if (!req.file || !qrid || !coadmin) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const qr = new QR({
      qrImage: req.file.path,   // ✅ This will be a Cloudinary URL
      qrId: qrid,
      assignedTo: coadmin
    });

    await qr.save();

    res.json({ success: true, message: '✅ QR uploaded to Cloudinary and assigned successfully' });
  } catch (err) {
    console.error('QR upload error:', err);
    res.status(500).json({ success: false, message: '❌ Server error during upload' });
  }
});

// UPDATE coordinator
router.put('/coordinator/:id', adminAuth, async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and Email required' });
  }

  try {
    const coordinator = await Coordinator.findById(req.params.id);
    if (!coordinator) {
      return res.status(404).json({ success: false, message: 'Coordinator not found' });
    }

    coordinator.name = name;
    coordinator.email = email;

    if (password) {
      coordinator.password = await bcrypt.hash(password, 10);
    }

    await coordinator.save();

    res.json({ success: true, message: 'Coordinator updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update coordinator' });
  }
});
// DELETE coordinator
router.delete('/coordinator/:id', adminAuth, async (req, res) => {
  try {
    const coordinator = await Coordinator.findById(req.params.id);
    if (!coordinator) {
      return res.status(404).json({ success: false, message: 'Coordinator not found' });
    }

    await coordinator.deleteOne();
    res.json({ success: true, message: 'Coordinator deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete coordinator' });
  }
});

// ---------------------- BOOKINGS ----------------------

router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('studentId', 'name email mobile')
      .populate('busId', 'busName travelDate timing pickup center price')
      .populate('confirmedBy', 'name email');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// ---------------------- STUDENTS ----------------------

router.get('/students', adminAuth, async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

export default router;
