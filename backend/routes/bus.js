// backend/routes/bus.js
import express from 'express';
import Bus from '../models/bus.js';
import { adminAuth } from '../middlewares/adminAuth.js';
import { studentAuth } from '../middlewares/student.js';

const router = express.Router();

// ✅ Create new bus
router.post('/', adminAuth, async (req, res) => {
  try {
    const { busName, seatCount, travelDate, timing, price, pickup, center } = req.body;

    if (!busName || !seatCount || !travelDate || !timing || !price || !pickup || !center) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newBus = new Bus({
      busName,
      seatCount: Number(seatCount),
      travelDate,
      timing,
      price: Number(price),
      pickup,
      center,
      seatsAvailable: Number(seatCount)
    });

    await newBus.save();
    res.status(201).json(newBus);
  } catch (err) {
    console.error("❌ Error creating bus:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get all buses
router.get('/', adminAuth, async (req, res) => {
  const buses = await Bus.find();
  res.json(buses);
});

// ✅ Update bus
router.put('/:id', adminAuth, async (req, res) => {
  const updated = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// ✅ Delete bus
router.delete('/:id', adminAuth, async (req, res) => {
  await Bus.findByIdAndDelete(req.params.id);
  res.json({ message: 'Bus deleted' });
});

// ✅ Check available bus before booking (for students)
router.post('/check', studentAuth, async (req, res) => {
  const { date, pickup, examCenter, time } = req.body;

  const bus = await Bus.findOne({
    travelDate: date,
    pickup,
    center: examCenter,
    timing: time,
    seatsAvailable: { $gt: 0 }
  });

  if (!bus) return res.json({ success: false });
  res.json({ success: true, bus });
});

export default router;
