// import { getOtpSender } from "../Services/otpServiceFactory.js";
// import { RESPONSES } from "../constants/responses.js";
// import { getOTP, deleteOTP } from "../utils/otpStore.js";

// export async function generateOtp(req, res, next) {
//   try {
//     const { phone, method } = req.body || {};
//     if (!phone) return res.status(400).json(RESPONSES.MISSING_PHONE);

//     const sender = getOtpSender(method);
//     if (!sender) return res.status(400).json(RESPONSES.INVALID_METHOD);

//     const result = await sender(phone);

//     // In dev you may expose the OTP. Remove in production.
//     if (result.devOtp) {
//       return res.json({ ...RESPONSES.OTP_TEST_GENERATED, devOtp: result.devOtp });
//     }
//     return res.json(RESPONSES.OTP_SENT);
//   } catch (err) {
//     next(err);
//   }
// }

// export async function verifyOtp(req, res, next) {
//   try {
//     const { phone, otp } = req.body || {};
//     if (!phone) return res.status(400).json(RESPONSES.MISSING_PHONE);
//     if (!otp) return res.status(400).json(RESPONSES.MISSING_OTP);

//     const record = getOTP(phone);
//     if (!record) return res.status(400).json(RESPONSES.OTP_NOT_FOUND);
//     if (record.expiresAt < Date.now()) return res.status(400).json(RESPONSES.OTP_EXPIRED);
//     if (record.otp !== otp) return res.status(400).json(RESPONSES.OTP_INVALID);

//     deleteOTP(phone);

//     // Here you can create a JWT for the user if needed
//     return res.json(RESPONSES.OTP_VERIFIED);
//   } catch (err) {
//     next(err);
//   }
// }
