// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
// import passport from './middlewares/passport.js';


import { fileURLToPath } from 'url';
import path from 'path';

// Load env variables
dotenv.config();

// Create app
const app = express();
const PORT = process.env.PORT || 4000;

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
// app.use(passport.initialize());
// app.use(passport.session());

// Static Frontend
app.use(express.static(path.join(__dirname, '../frontend/Public')));

// Routes
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import adminRoutes from './routes/admin.js';
import busRoutes from './routes/bus.js';
import pickupRoutes from './routes/pickup.js';
import centerRoutes from './routes/center.js';
import exportRoutes from './routes/export.js';


app.use('/api/buses', busRoutes); // ✅ must exist


app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/pickup', pickupRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/export', exportRoutes);

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});
app.use(express.static(path.join(__dirname, '../frontend/Public')));



// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});