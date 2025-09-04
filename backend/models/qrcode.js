// models/qrcode.js
import mongoose from 'mongoose';

const qrCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  coadmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coordinator',
    required: true
  }
}, {
  timestamps: true
});

const QRCode = mongoose.model('QRCode', qrCodeSchema);
export default QRCode;
