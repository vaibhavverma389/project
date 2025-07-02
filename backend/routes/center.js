// backend/routes/center.js
import express from 'express';
import Center from '../models/center.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = express.Router();

// ✅ Get all centers
router.get('/', async (req, res) => {
  const centers = await Center.find();
  res.json(centers);
});

// ✅ Create new center
router.post('/', adminAuth, async (req, res) => {
  const center = await Center.create(req.body);
  res.json(center);
});

// ✅ Delete center
router.delete('/:id', adminAuth, async (req, res) => {
  await Center.findByIdAndDelete(req.params.id);
  res.json({ message: 'Center deleted' });
});

// ✅ Update center
router.put('/:id', adminAuth, async (req, res) => {
  const updated = await Center.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

export default router;
