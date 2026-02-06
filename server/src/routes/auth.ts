import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import * as authController from '../controllers/auth.controller';

const router = express.Router();

// Signup
router.post('/signup', asyncHandler(authController.signup));

// Login
router.post('/login', asyncHandler(authController.login));

export default router;
