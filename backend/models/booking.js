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
  
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
