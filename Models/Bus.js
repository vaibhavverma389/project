import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  seatCount: { type: Number, required: true },
  travelDate: { type: String, required: true },
  timing: { type: String, required: true },
  price: { type: Number, required: true },
  seatsAvailable: { type: Number, required: true },
}, { timestamps: true });

const Bus = mongoose.model('Bus', busSchema);

// ✅ Correct ES module export
export default Bus;
