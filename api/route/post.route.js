import express, { Router } from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { CreatePost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, CreatePost);
export default router;