import express from 'express';
import { checkIn, getMyAttendance, getUnitAttendance } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/check-in', protect, checkIn);
router.get('/my-attendance', protect, getMyAttendance);
router.get('/unit-attendance', protect, authorize('ano', 'battalion_admin'), getUnitAttendance);

export default router;
