// backend/routes/pickup.js
import express from 'express';
import Pickup from '../models/pickup.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = express.Router();

// ✅ Get all pickups
router.get('/', async (req, res) => {
  const pickups = await Pickup.find();
  res.json(pickups);
});

// ✅ Create new pickup
router.post('/', adminAuth, async (req, res) => {
  const pickup = await Pickup.create(req.body);
  res.json(pickup);
});

// ✅ Delete pickup
router.delete('/:id', adminAuth, async (req, res) => {
  await Pickup.findByIdAndDelete(req.params.id);
  res.json({ message: 'Pickup point deleted' });
});

// ✅ Update pickup
router.put('/:id', adminAuth, async (req, res) => {
  const updated = await Pickup.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

export default router;