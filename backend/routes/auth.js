import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/admin.js';
// import passport from '../middlewares/passport.js';

const router = express.Router();



router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

router.post('/admin/setup-default', async (req, res) => {
  const existing = await Admin.findOne({ email: "admin@example.com" });
  if (existing) return res.status(400).json({ message: "Default admin already exists" });

  const hashed = await bcrypt.hash("admin123", 10);
  const admin = await Admin.create({
    name: "Head Admin",
    email: "admin@example.com",
    password: hashed,
    mobile: "9999999999"
  });

  res.json({ message: "Default admin created", admin });
});

export default router;