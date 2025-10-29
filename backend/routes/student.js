// backend/routes/student.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/student.js';
import { studentAuth } from '../middlewares/student.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password, mobile, gender, pmobile, roll } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required' });

  const exists = await Student.findOne({ email });
  if (exists) return res.status(400).json({ error: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const student = await Student.create({ name, email, password: hashed, mobile, pmobile, roll, gender });
  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, student });
});

router.post('/login', async (req, res) => {
  const { email } = req.body;
  const student = await Student.findOne({ email });
  if (!student) return res.status(404).json({ error: 'Student not found' });
  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, student });
});

router.get('/profile', studentAuth, async (req, res) => {
  const student = await Student.findById(req.student._id).select('-password');
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});



// ✅ Get logged-in student info
router.get('/me', studentAuth, async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select('-password');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error('❌ Error fetching student info:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



export default router;