import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import excel from 'exceljs';
import session from 'express-session';
import passport from './middlewares/passport.js';
import QrCode from './models/qrcode.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import { adminAuth } from './middlewares/adminAuth.js';
import { studentAuth } from './middlewares/student.js';
import Admin from './models/admin.js';
import Student from './models/student.js';
import Pickup from './models/pickup.js';
import Center from './models/center.js';
import Bus from './models/bus.js';
import Booking from './models/Booking.js';

import path from 'path';
import { fileURLToPath } from 'url';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGO_URI

).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// (async () => {
//   try {
//     const adminCount = await Admin.countDocuments();
//     if (adminCount === 0) {
//       const hashed = await bcrypt.hash('admin123', 10);
//       await Admin.create({
//         name: "Default Admin",
//         email: "admin@smartbus.in",
//         mobile: "9999999999",
//         password: hashed,
//         role: "admin"
//       });
//       console.log("✅ Default admin created: admin@smartbus.in / admin123");
//     }
//   } catch (err) {
//     console.error("❌ Failed to create default admin:", err);
//   }
// })();

  
// (async () => {
//   try {
//     const adminCount = await Admin.countDocuments();
//     if (adminCount === 0) {
//       const hashed = await bcrypt.hash('admin123', 10);
//       const defaultAdmin = await Admin.create({
//         name: 'Vaibhav Verma',
//         email: 'admin@smartbus.in',
//         mobile: '9876543210',
//         password: hashed,
//         role: 'admin'
//       });
//       console.log('✅ Default admin created:', defaultAdmin.email,defaultAdmin.password);
//     }
//   } catch (err) {
//     console.error('❌ Failed to create default admin:', err.message);
//   }
// })();


// ////////////////////
// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'qr_codes',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});
const upload = multer({ storage });

// Static Public
app.use(express.static(path.join(__dirname, 'Public')));

// ---------------------------- GOOGLE AUTH ----------------------------
app.get('/api/student/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/student/google/callback',
  passport.authenticate('google', { failureRedirect: '/login.html' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`/home.html?token=${token}&name=${encodeURIComponent(req.user.name)}`);
  }
);

// ---------------------------- QR UPLOAD ----------------------------
app.post('/admin/qr-upload', adminAuth, upload.single('qrImage'), async (req, res) => {
  const { qrId, assignTo } = req.body;
  if (!qrId || !req.file?.path) return res.status(400).json({ error: 'QR ID and image required' });

  const exists = await QrCode.findOne({ qrId });
  if (exists) return res.status(400).json({ error: 'QR ID already exists' });

  const qr = await QrCode.create({
    qrId,
    imageUrl: req.file.path,
    uploadedBy: req.admin._id,
    assignedTo: assignTo || null
  });

  res.json({ success: true, qr });
});

app.get('/admin/qr-codes', adminAuth, async (req, res) => {
  const qrs = await QrCode.find().populate('assignedTo uploadedBy', 'name email role');
  res.json(qrs);
});
app.get('/api/qrs', async (req, res) => {
  const qrs = await QrCode.find({}, { qrId: 1, imageUrl: 1 }).sort({ createdAt: -1 });
  res.json(qrs);
});

// ✅ Get all admins
app.get('/admin/all', adminAuth, async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
});

// ✅ Get all registered students
app.get('/admin/students', adminAuth, async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// ---------------------------- STUDENT AUTH ----------------------------
app.post('/student/signup', async (req, res) => {
  try {
    const { name, email, password, mobile, parentmobile, university } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required' });

    const exists = await Student.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const student = await Student.create({
      name, email, password: hashed, mobile, parentmobile, university
    });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, student });

  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ error: 'An error occurred during sign-up. Try again later.' });
  }
});


app.post('/student/login', async (req, res) => {
  const { email } = req.body;
  const student = await Student.findOne({ email });
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, student });
});

// ---------------------------- ADMIN AUTH ----------------------------
app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

app.post('/admin/create', adminAuth, async (req, res) => {
  const { email, password } = req.body;
  const exists = await Admin.findOne({ email });
  if (exists) return res.status(400).json({ error: 'Admin already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ email, password: hashed });
  res.json(admin);
});

app.get('/admins', adminAuth, async (req, res) => {
  const admins = await Admin.find().select('-password');
  res.json(admins);
});

app.delete('/admin/:id', adminAuth, async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.json({ message: 'Admin deleted' });
});

// ---------------------------- BUS SYSTEM ----------------------------
app.post('/api/buses', adminAuth, async (req, res) => {
  const { name, totalSeats, date, pickupPoints, examCenter, price, timing } = req.body;
  if (!name || !totalSeats || !date || !pickupPoints || !examCenter || !price || !timing) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const bus = await Bus.create({
    name,
    totalSeats,
    seatsAvailable: totalSeats,
    date,
    pickupPoints,
    examCenter,
    price,
    timing: timing.toLowerCase()
  });
  res.json(bus);
});

app.get('/api/buses', adminAuth, async (req, res) => {
  const buses = await Bus.find();
  res.json(buses);
});

app.put('/api/buses/:id', adminAuth, async (req, res) => {
  const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(bus);
});

app.delete('/api/buses/:id', adminAuth, async (req, res) => {
  await Bus.findByIdAndDelete(req.params.id);
  res.json({ message: 'Bus deleted' });
});

// ---------------------------- BOOKING ----------------------------
app.post('/api/buses/check', studentAuth, async (req, res) => {
  const { date, pickup, examCenter, time } = req.body;
  const bus = await Bus.findOne({
    date,
    pickupPoints: pickup,
    examCenter,
    timing: time.toLowerCase(),
    seatsAvailable: { $gt: 0 }
  });
  if (!bus) return res.json({ success: false });
  res.json({ success: true, bus });
});

app.post('/bookings', studentAuth, async (req, res) => {
  const { date, pickup, examCenter, time, busName } = req.body;
  const bus = await Bus.findOne({
    date,
    pickupPoints: pickup,
    examCenter,
    timing: time.toLowerCase(),
    name: busName,
    seatsAvailable: { $gt: 0 }
  });
  if (!bus) return res.status(404).json({ message: 'Bus not found or full' });

  const exists = await Booking.findOne({ studentId: req.student._id, busId: bus._id });
  if (exists) return res.status(400).json({ message: 'Already booked' });

  const booking = await Booking.create({
    studentId: req.student._id,
    busId: bus._id,
    date,
    pickupPoint: pickup,
    examCenter,
    time,
    price: bus.price
  });

  bus.seatsAvailable -= 1;
  await bus.save();
  res.json({ booking });
});

app.get('/bookings', studentAuth, async (req, res) => {
  const bookings = await Booking.find({ studentId: req.student.id }).populate('busId').populate('studentId');
  res.json(bookings);
});

app.get('/api/bookings', adminAuth, async (req, res) => {
  const bookings = await Booking.find().populate('studentId').populate('busId');
  res.json(bookings);
});

app.post('/admin/bookings/confirm/:id', adminAuth, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Not found' });
  if (booking.status === 'confirmed') return res.status(400).json({ message: 'Already confirmed' });

  booking.status = 'confirmed';
  booking.confirmedBy = req.admin._id;
  await booking.save();
  res.json({ success: true });
});

app.delete('/admin/bookings/:id', adminAuth, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  const bus = await Bus.findById(booking.busId);
  if (bus) {
    bus.seatsAvailable += 1;
    await bus.save();
  }

  await Booking.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ---------------------------- PICKUPS / CENTERS ----------------------------
app.get('/api/pickup', async (req, res) => {
  const pickups = await Pickup.find();
  res.json(pickups);
});

app.post('/api/pickup', adminAuth, async (req, res) => {
  const pickup = await Pickup.create(req.body);
  res.json(pickup);
});

app.get('/api/centers', async (req, res) => {
  const centers = await Center.find();
  res.json(centers);
});

app.post('/api/centers', adminAuth, async (req, res) => {
  const center = await Center.create(req.body);
  res.json(center);
});
//------------------------
app.get('/api/student/profile', studentAuth, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select('-password');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error('❌ Profile Load Error:', err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// ---------------------------- EXCEL EXPORT ----------------------------
app.get('/admin/export/students', adminAuth, async (req, res) => {
  const workbook = new excel.Workbook();
  const sheet = workbook.addWorksheet('Students');
  sheet.columns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Mobile', key: 'mobile' },
    { header: 'Parent Mobile', key: 'parentmobile' },
    { header: 'University Roll', key: 'university' }
  ];
  const students = await Student.find();
  sheet.addRows(students.map(s => s.toObject()));

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

app.get('/admin/export/bookings', adminAuth, async (req, res) => {
  const workbook = new excel.Workbook();
  const sheet = workbook.addWorksheet('Bookings');
  sheet.columns = [
    { header: 'Student Name', key: 'studentName' },
    { header: 'Email', key: 'email' },
    { header: 'Bus Name', key: 'busName' },
    { header: 'Date', key: 'date' },
    { header: 'Pickup', key: 'pickupPoint' },
    { header: 'Center', key: 'examCenter' },
    { header: 'Time', key: 'time' },
    { header: 'Price', key: 'price' }
  ];
  const bookings = await Booking.find().populate('studentId').populate('busId');
  sheet.addRows(bookings.map(b => ({
    studentName: b.studentId?.name,
    email: b.studentId?.email,
    busName: b.busId?.name,
    date: b.date,
    pickupPoint: b.pickupPoint,
    examCenter: b.examCenter,
    time: b.time,
    price: b.price
  })));

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=bookings.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

// ---------------------------- DEFAULT ----------------------------
app.get(/^\/(?!api|admin|bookings).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'home.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
