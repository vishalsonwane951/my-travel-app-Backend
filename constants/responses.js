export const RESPONSES = {
  MISSING_PHONE: { type: "error", message: "Phone number is required" },
  MISSING_OTP: { type: "error", message: "OTP is required" },
  INVALID_METHOD: { type: "error", message: "Invalid method. Use 'firebase' or 'twilio'." },
  OTP_SENT: { type: "success", message: "OTP sent successfully" },
  OTP_TEST_GENERATED: { type: "success", message: "OTP generated (Firebase test mode)" },
  OTP_NOT_FOUND: { type: "error", message: "OTP not found" },
  OTP_EXPIRED: { type: "error", message: "OTP expired" },
  OTP_INVALID: { type: "error", message: "Invalid OTP" },
  OTP_VERIFIED: { type: "success", message: "OTP verified successfully" }
};
