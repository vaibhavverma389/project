// backend/routes/admin.js

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';
import Booking from '../models/booking.js';
import Student from '../models/student.js';


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
