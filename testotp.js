// testTwilio.js
import 'dotenv/config';  // Load .env at the very top
import twilio from 'twilio';

// Check if environment variables are loaded
console.log("SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("TOKEN:", process.env.TWILIO_AUTH_TOKEN);
console.log("FROM:", process.env.TWILIO_PHONE_NUMBER);

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendTestOTP() {
  try {
    const toNumber = '+917888251550'; // Replace with your number
    const message = await client.messages.create({
      body: 'Hello! This is a test OTP.',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toNumber
    });
    console.log('✅ Test OTP sent! Message SID:', message.sid);
  } catch (err) {
    console.error('❌ Error sending OTP:', err);
  }
}

sendTestOTP();
