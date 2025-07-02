// models/Student.js
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  roll: { type: String, required: true },
  gender: { type: String, required: true },
  pmobile: { type: String, required: true },
  password: { type: String, required: true }
});

export default mongoose.model('Student', studentSchema);
