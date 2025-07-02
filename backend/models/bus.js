
import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  name: String,
  seatCount: Number,
  seatsAvailable: Number,
  travelDate: String,
  timing: String,
  pickupPoints: [String],
  examCenter: String,
  price: Number
});



export default mongoose.model('Bus', busSchema);
