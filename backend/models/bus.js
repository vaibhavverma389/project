
import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  seatCount: { type: Number, required: true },
  travelDate: { type: String, required: true },
  timing: { type: String, required: true },
  price: { type: Number, required: true },
  seatsAvailable: { type: Number, required: true },
  examCenter: { type: String, required: true },
  pickupPoints: [{ type: String, required: true }]
});


export default mongoose.model('Bus', busSchema);
