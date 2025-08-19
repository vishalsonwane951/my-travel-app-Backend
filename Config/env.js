import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  ALLOWED_IPS: (process.env.ALLOWED_IPS || "127.0.0.1,::1").split(",").map(s => s.trim()),
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || "",
  OTP_TTL_MS: Number(process.env.OTP_TTL_MS || 300000) // 5 mins
};
