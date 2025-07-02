import mongoose from 'mongoose';

const centerSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const Center = mongoose.model('Center', centerSchema);

// ✅ Export correctly
export default Center;
