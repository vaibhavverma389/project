// models/Coordinator.js
import mongoose from 'mongoose';

const coordinatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'coordinator' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Coordinator', coordinatorSchema);
