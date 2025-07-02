// Admin schema
import mongoose from 'mongoose';

const coadminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  mobile: String,
});

export default mongoose.model('coAdmin', coadminSchema);
