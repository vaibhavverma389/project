// backend/routes/export.js
import express from 'express';
import excel from 'exceljs';
import Student from '../models/student.js';
import Booking from '../models/booking.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = express.Router();

// ✅ Export students to Excel
router.get('/students', adminAuth, async (req, res) => {
  const workbook = new excel.Workbook();
  const sheet = workbook.addWorksheet('Students');

  sheet.columns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Mobile', key: 'mobile' },
    { header: 'Parent Mobile', key: 'pmobile' },
    { header: 'University Roll', key: 'roll' }
  ];

  const students = await Student.find();
  sheet.addRows(students.map(s => s.toObject()));

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

// ✅ Export bookings to Excel
router.get('/bookings', adminAuth, async (req, res) => {
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
    { header: 'Price', key: 'price' },
    { header: 'UTR No', key: 'utr' },
    { header: 'Confirmed By', key: 'adminname' }
  ];

  const bookings = await Booking.find().populate('studentId').populate('busId');
  sheet.addRows(bookings.map(b => ({
    studentName: b.studentId?.name,
    email: b.studentId?.email,
    busName: b.busId?.busName,
    date: b.date,
    pickupPoint: b.pickupPoint,
    examCenter: b.examCenter,
    time: b.time,
    price: b.price,
    utr: b.utrno,
    adminname: b.confirmedBy?.name || 'N/A'
  })));

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=bookings.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

export default router;