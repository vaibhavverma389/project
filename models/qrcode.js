// models/QrCode.js
import mongoose from 'mongoose';

const qrCodeSchema = new mongoose.Schema({
  qrId: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // Assuming your admin model is named "Admin"
    required: true,
  },
}, {
  timestamps: true
});

const QrCode = mongoose.model('QrCode', qrCodeSchema);
export default QrCode;
