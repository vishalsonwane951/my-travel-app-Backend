import express from 'express'
import * as ctrl from '../Controllers/UserController.js';
import { protect, admin } from '../Middlewares/authMiddleware.js';
import {uploaders} from '../utils/cloudinary.js';
import {generateOTP} from '../Controllers/OtpController.js'

const router = express.Router();
// Public
router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/send-otp-email', ctrl.sendOtpEmail);
router.post('/send-otp-mobile', ctrl.sendOtpMobile);
router.post('/verify-otp', ctrl.verifyOtp);
router.post("/generate-login-otp", generateOTP);

// Authenticated
router.get('/me', protect, ctrl.getMe);
router.get('/profile', protect, ctrl.getUserProfile);
router.put('/update-profile', protect, ctrl.updateProfile);
router.put('/change-password', protect, ctrl.changePassword);
router.put('/avatar', protect, uploaders.avatars.single('avatar'), ctrl.updateAvatar);
router.get('/avatar/:id', ctrl.getAvatar);

// Admin
router.get('/users', protect, admin, ctrl.getAllUsers);
router.delete('/users/:id', protect, admin, ctrl.deleteUser);

export default router;
