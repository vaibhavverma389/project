import mongoose from 'mongoose';

const pickupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Pickup = mongoose.model('Pickup', pickupSchema);

// ✅ Correct export
export default Pickup;
