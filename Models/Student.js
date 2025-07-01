import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  roll: String,
  password: String,
  googleId: String
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
