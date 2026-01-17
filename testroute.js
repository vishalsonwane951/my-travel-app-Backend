// routes/testRoute.js
import express from 'express';
import OTPService from '../utils/generateOtp.js';

const router = express.Router();

router.get('/test-otp', async (req, res) => {
  try {
    // Use your number here
    await OTPService.sendMobileOTP('917888251550');
    res.send('Test OTP sent successfully!');
  } catch (err) {
    console.error('Test OTP error:', err);
    res.status(500).send('Failed to send test OTP: ' + err.message);


  }


});

export default router;
