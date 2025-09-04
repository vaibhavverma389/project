// middlewares/coordinatorAuth.js
import jwt from 'jsonwebtoken';
import Coordinator from '../models/Coordinator.js';

export const coordinatorAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const coordinator = await Coordinator.findById(decoded.id);
    if (!coordinator) return res.status(401).json({ success: false, message: 'Invalid token' });

    req.coordinator = coordinator;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};
