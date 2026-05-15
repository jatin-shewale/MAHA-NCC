import express from 'express';
import { createCamp, getCamps, applyToCamp, getApplications } from '../controllers/campController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getCamps);
router.post('/', protect, authorize('ano', 'battalion_admin'), createCamp);
router.post('/apply', protect, applyToCamp);
router.get('/applications', protect, authorize('ano', 'battalion_admin'), getApplications);

export default router;
