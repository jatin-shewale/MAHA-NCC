import express from 'express';
import { createPost, getFeed, getPendingPosts, moderatePost, toggleLike } from '../controllers/socialController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/feed', protect, getFeed);
router.post('/post', protect, createPost);
router.get('/pending', protect, authorize('ano', 'battalion_admin'), getPendingPosts);
router.post('/moderate', protect, authorize('ano', 'battalion_admin'), moderatePost);
router.post('/like/:id', protect, toggleLike);

export default router;
