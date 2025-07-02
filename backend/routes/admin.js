
// backend/routes/admin.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';
import CoAdmin from '../models/coadmin.js';
import Booking from '../models/booking.js';
import QrCode from '../models/qrcode.js';
import Student from '../models/student.js';
import upload from '../utils/cloudinaryUpload.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = express.Router();
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

router.get('/coadmins', adminAuth, async (req, res) => {
  const coadmins = await Admin.find({ role: 'co-admin' }, '_id name email');
  res.json(coadmins);
});

router.get('/bookings', adminAuth, async (req, res) => {
  const bookings = await Booking.find()
    .populate('studentId', 'name email mobile')
    .populate('busId', 'busName travelDate timing pickup center price')
    .populate('confirmedBy', 'name email');
  res.json(bookings);
});

router.post('/create', adminAuth, async (req, res) => {
  const { name, email, password, mobile } = req.body;
  const existing = await Admin.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email already exists' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ name, email, password: hashedPassword, mobile });
  res.json({ message: 'Admin created', admin });
});

router.delete('/:id', adminAuth, async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.json({ message: 'Admin deleted' });
});

// CoAdmin APIs
router.post('/coadmin/create', adminAuth, async (req, res) => {
  const { name, email, password, mobile } = req.body;
  const existing = await CoAdmin.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email already exists' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const coadmin = await CoAdmin.create({ name, email, password: hashedPassword, mobile });
  res.json({ message: 'Co Admin created', coadmin });
});

router.get('/coadmins', adminAuth, async (req, res) => {
  const coadmins = await CoAdmin.find().select('-password');
  res.json(coadmins);
});

router.delete('/coadmin/:id', adminAuth, async (req, res) => {
  await CoAdmin.findByIdAndDelete(req.params.id);
  res.json({ message: 'Co Admin deleted' });
});
router.get('/students', adminAuth, async (req, res) => {
  try {
    const students = await Student.find().select('-password'); // optional: exclude password
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});
export default router;
