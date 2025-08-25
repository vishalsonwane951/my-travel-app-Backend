import axios from 'axios';

class Msg91OTPService {
  async sendOTP(mobile, templateId, authKey, expiry = 5) {
    try {
      const options = {
        method: "POST",
        url: "https://control.msg91.com/axios/v5/otp",
        params: {
          mobile,
          template_id: process.env.MSG91_TEMPLATE_ID,
          authkey: process.env.MSG91_AUTHKEY,
          otp_expiry: expiry,
          realTimeResponse: "1"
        },
        headers: { "Content-Type": "application/json" }
      };

      const { data } = await axios.request(options);
      console.log("✅ OTP sent:", data);
      console.log("OTP: ",data.otp)
      return data;

    } catch (error) {
      console.error("❌ Error sending OTP:", error.response?.data || error.message);
      throw new Error("Failed to send OTP");
    }
  }
}

// Export an instance
export default new Msg91OTPService();
