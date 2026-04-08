import nodemailer from "nodemailer";

export const sendEmailOtp = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login OTP",
      html: `
        <h3>Login OTP</h3>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP expires in 5 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent to:", email);

  } catch (error) {
    console.error("Email send error:", error);
  }
};