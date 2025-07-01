// Booking schema
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
  date: String,
  pickupPoint: String,
  examCenter: String,
  time: String,
  price: Number,
  status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
  confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
