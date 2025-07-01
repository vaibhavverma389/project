// Admin JWT middleware
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) return res.status(401).json({ message: 'Invalid admin' });

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Optional middleware if only full admins should access
export const onlyMainAdmin = (req, res, next) => {
  if (req.admin.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};
