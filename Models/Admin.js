// Admin schema
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  mobile: String,
  role: { type: String, enum: ['admin', 'co-admin'], default: 'co-admin' }
});

export default mongoose.model('Admin', adminSchema);
