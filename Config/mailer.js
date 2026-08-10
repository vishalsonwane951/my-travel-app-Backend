import nodemailer from "nodemailer";

let transporter;

export const getMailer = () => {
  if (transporter) return transporter;

  const {
    SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn("[Mailer] SMTP not configured. Emails will be logged only.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: String(SMTP_SECURE) === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  const mailer = getMailer();
  if (!mailer) {
    console.log(`[MAIL] To: ${to}\nSubject: ${subject}\nHTML:\n${html}`);
    return { queued: true };
  }
  const from = process.env.EMAIL_FROM || "no-reply@mytravelapp.com";
  return mailer.sendMail({ from, to, subject, html });
};
