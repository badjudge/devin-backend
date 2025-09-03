import express from 'express';
const router = express.Router();




import {
 
  verifyOtp,
  loginWithPassword,
} from '../controllers/authController.js';

// Routes
router.post('/login-password', loginWithPassword); // ✅ Add this
//router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;
