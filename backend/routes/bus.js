// backend/routes/bus.js
import express from 'express';
import Bus from '../models/bus.js';
import { adminAuth } from '../middlewares/adminAuth.js';
import { studentAuth } from '../middlewares/student.js';

const router = express.Router();


// ✅ CREATE NEW BUS (Admin Only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { busName, seatCount, travelDate, timing, price, pickup, center } = req.body;

    if (!busName || !seatCount || !travelDate || !timing || !price || !pickup || !center) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newBus = new Bus({
      name: busName,
      seatCount: Number(seatCount),
      seatsAvailable: Number(seatCount), // full initially
      travelDate, // should be string like "2025-07-06"
      timing, // e.g., "Forenoon"
      pickupPoints: Array.isArray(pickup) ? pickup : [pickup], // always store as array
      examCenter: center,
      price: Number(price)
    });

    await newBus.save();
    res.status(201).json(newBus);
  } catch (err) {
    console.error("❌ Error creating bus:", err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ GET ALL BUSES (Admin Only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    console.error("❌ Error fetching buses:", err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ UPDATE BUS (Admin Only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const updated = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating bus:", err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ DELETE BUS (Admin Only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bus deleted' });
  } catch (err) {
    console.error("❌ Error deleting bus:", err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ STUDENT BUS SEARCH (token protected)
router.post('/check', studentAuth, async (req, res) => {
  const { travelDate, pickup, center, timing } = req.body;
  console.log('🔍 Bus check request:', { travelDate, pickup, center, timing });

  try {
    const bus = await Bus.findOne({
      travelDate,                              // match travel date
      pickupPoints: { $in: [pickup] },         // pickup must be in pickupPoints array
      examCenter: center,                      // match exam center
      timing: { $regex: new RegExp(`^${timing}$`, 'i') },                                 
      seatsAvailable: { $gt: 0 }               
    });


    if (!bus) {
      return res.status(404).json({ success: false, message: 'No bus available for this route.' });
    }

    res.json({ success: true, bus });
  } catch (err) {
    console.error("❌ Bus search error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




export default router;
