
import mongoose from 'mongoose';
const qrCodeSchema = new mongoose.Schema({
  upiId: String,
  imagePath: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});
export default mongoose.model('QrCode', qrCodeSchema);
