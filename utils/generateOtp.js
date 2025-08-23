// import axios from "axios";

// class Msg91OTPService {
//   constructor() {
//     this.authKey = process.env.MSG91_AUTHKEY;
//     this.templateId = process.env.MSG91_TEMPLATE_ID;
//   }

//   async sendOTP(phone, vars = {}) {
//     try {
//       const payload = {
//         template_id: this.templateId,
//         recipients: [
//           {
//             mobiles: phone,
//             ...vars
//           }
//         ]
//       };

//       const options = {
//         method: 'POST',
//         url: 'https://control.msg91.com/api/v5/flow',
//         headers: {
//           accept: 'application/json',
//           authkey: this.process.env.MSG91_AUTHKEY,
//           'content-type': 'application/json'
//         },
//         data: JSON.stringify(payload)
//       };

//       const { data } = await axios.request(options);
//       console.log(`✅ OTP sent to ${phone}:`, data);
//       return data;

//     } catch (error) {
//       console.error(`❌ Error sending OTP to ${phone}:`, error.response?.data || error.message);
//       throw new Error('Failed to send OTP');
//     }
//   }
// }

// export default new Msg91OTPService();

