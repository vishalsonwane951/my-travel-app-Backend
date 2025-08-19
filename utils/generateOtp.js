// utils/otpService.js
import crypto from 'crypto';
import twilio from 'twilio';
import OTP from '../Models/OtpModel.js';

// Twilio client setup
// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// class OTPService {
//   constructor() {
//     this.otpExpiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
//     this.otpLength = parseInt(process.env.OTP_LENGTH) || 6;
//   }

//   // Generate a numeric OTP of given length
//   async generateOTP() {
//     return crypto.randomInt(
//       10 ** (this.otpLength - 1),
//       10 ** this.otpLength - 1
//     ).toString();
//   }

//   // Format mobile to E.164 format for Twilio
//   formatMobile(mobileNumber) {
//     let formatted = mobileNumber.trim();

//     // Add +91 if it's an Indian number without country code
//     if (/^[6-9]\d{9}$/.test(formatted)) {
//       formatted = `+91${formatted}`;
//     }

//     // Ensure it starts with +
//     if (!formatted.startsWith('+')) {
//       throw new Error('Invalid phone number format. Must be in E.164 format.');
//     }

//     return formatted;
//   }

//   // Send OTP via Twilio
//   async sendOTP(mobileNumber, otp) {
//     try {
//       const formattedNumber = this.formatMobile(mobileNumber);

//       await twilioClient.messages.create({
//         body: `Your OTP is: ${otp}. Valid for ${this.otpExpiryMinutes} minutes.`,
//         from: process.env.TWILIO_PHONE_NUMBER,
//         to: formattedNumber
//       });

//       return true;
//     } catch (error) {
//       console.error(`Failed to send OTP to ${mobileNumber}:`, error);
//       throw new Error(error.message || 'Failed to send OTP via Twilio');
//     }
//   }

//   // Create OTP record in DB
//   async createOTPRecord(email, purpose = 'login') {
//     const otp = await this.generateOTP();
//     const expiresAt = new Date(Date.now() + this.otpExpiryMinutes * 60 * 1000);

//     await OTP.findOneAndUpdate(
//       { email, purpose },
//       { otp, expiresAt, verified: false },
//       { upsert: true, new: true }
//     );

//     return otp;
//   }

//   // Verify OTP
//   async verifyOTP(email, otp, purpose = 'login') {
//     try {
//       const otpRecord = await OTP.findOne({
//         email,
//         purpose,
//         expiresAt: { $gt: new Date() }
//       });

//       if (!otpRecord) {
//         return { isValid: false, message: 'OTP expired or not found' };
//       }

//       if (otpRecord.verified) {
//         return { isValid: false, message: 'OTP already used' };
//       }

//       if (otpRecord.otp !== otp) {
//         return { isValid: false, message: 'Invalid OTP' };
//       }

//       otpRecord.verified = true;
//       await otpRecord.save();

//       return { isValid: true, message: 'OTP verified successfully' };
//     } catch (error) {
//       console.error('Database error during OTP verification:', error);
//       throw new Error(error.message || 'Failed to verify OTP');
//     }
//   }

//   // Main function to create + send OTP
//   async sendMobileOTP(email, mobileNumber, purpose = 'login') {
//     try {
//       const otp = await this.createOTPRecord(email, purpose);
//       await this.sendOTP(mobileNumber, otp);

//       return { success: true, message: 'OTP sent successfully' };
//     } catch (error) {
//       console.error('Error in sendMobileOTP:', error);
//       throw new Error(error.message || 'Failed to send OTP');
//     }
//   }
// }

// export default new OTPService();


import axios from "axios";

class Msg91OTPService {
  constructor() {
    this.authKey = process.env.MSG91_AUTHKEY;
    this.templateId = process.env.MSG91_TEMPLATE_ID;
  }

  async sendOTP(phone, vars = {}) {
    try {
      const payload = {
        template_id: this.templateId,
        recipients: [
          {
            mobiles: phone,
            ...vars
          }
        ]
      };

      const options = {
        method: 'POST',
        url: 'https://control.msg91.com/api/v5/flow',
        headers: {
          accept: 'application/json',
          authkey: this.process.env.MSG91_AUTHKEY,
          'content-type': 'application/json'
        },
        data: JSON.stringify(payload)
      };

      const { data } = await axios.request(options);
      console.log(`✅ OTP sent to ${phone}:`, data);
      return data;

    } catch (error) {
      console.error(`❌ Error sending OTP to ${phone}:`, error.response?.data || error.message);
      throw new Error('Failed to send OTP');
    }
  }
}

export default new Msg91OTPService();

