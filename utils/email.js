import nodemailer from 'nodemailer';

/** Lazily-created transporter – recreated if env changes */
let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;
  _transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  return _transporter;
}

/** Safe send – never throws; logs on failure */
async function sendMail(options) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Email] EMAIL_USER / EMAIL_PASS not set – skipping email');
    return;
  }
  try {
    await getTransporter().sendMail({ from: process.env.EMAIL_USER, ...options });
  } catch (err) {
    console.error('[Email] send error:', err.message);
  }
}

// ─── Templates ────────────────────────────────────────────────

const adminEmail = () => process.env.ADMIN_EMAIL || 'bookings@desivdesi.com';
const frontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * Generic plain-message email — used by the admin Notification Center
 * (Part B, Module 15) to broadcast arbitrary messages to a recipient list.
 */
export async function sendPlainEmail(to, subject, message) {
  await sendMail({
    to,
    subject,
    html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#333;">
      <p>${String(message).replace(/\n/g, '<br/>')}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
      <p style="color:#999;font-size:12px;">Desivdesi</p>
    </div>`,
  });
}


/**
 * New booking → admin + customer emails
 */
export async function sendBookingEmails(booking) {
  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px">
      <h2 style="color:#2c3e50">New Booking Enquiry</h2>
      <p><b>ID:</b> ${booking.bookingId || booking._id}</p>
      <p><b>Type:</b> ${booking.enquiryType}</p>
      <p><b>Package:</b> ${booking.packageName}</p>
      <p><b>Destination:</b> ${booking.destination}</p>
      <hr/>
      <p><b>Name:</b> ${booking.fullName}</p>
      <p><b>Email:</b> ${booking.email}</p>
      <p><b>Phone:</b> ${booking.mobile}</p>
      <hr/>
      <p><b>Start:</b> ${booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'Flexible'}</p>
      <p><b>Duration:</b> ${booking.duration} days</p>
      <p><b>Travellers:</b> ${booking.adults} Adults · ${booking.children} Children · ${booking.seniors} Seniors</p>
      <p><b>Budget:</b> ₹${booking.budget || 'On request'}</p>
      <p><b>Message:</b> ${booking.Message || '—'}</p>
      <br/>
      <a href="${frontendUrl()}/admin/bookings/${booking._id}"
         style="background:#3498db;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px">
        View in Dashboard
      </a>
    </div>`;

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px">
      <h2 style="color:#2c3e50">Thank You for Your Enquiry!</h2>
      <p>Dear ${booking.fullName},</p>
      <p>We received your enquiry for <b>${booking.packageName}</b>.</p>
      <p>Reference: <b>${booking.bookingId || booking._id}</b></p>
      <div style="background:#f8f9fa;padding:16px;border-radius:8px;margin:16px 0">
        <p><b>Package:</b> ${booking.packageName}</p>
        <p><b>Destination:</b> ${booking.destination}</p>
        <p><b>Travel Date:</b> ${booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'Flexible'}</p>
        <p><b>Duration:</b> ${booking.duration} days</p>
        <p><b>Travellers:</b> ${booking.adults} Adults, ${booking.children} Children</p>
      </div>
      <p>Our expert will contact you within <b>24 hours</b>.</p>
      <p>📞 +91 98765 43210 &nbsp;|&nbsp; 📧 support@desivdesi.com</p>
      <p style="color:#999;font-size:.85em">Thank you for choosing Desi V Desi Tours!</p>
    </div>`;

  await Promise.all([
    sendMail({ to: adminEmail(), subject: `New Booking: ${booking.bookingId || booking._id}`, html: adminHtml }),
    sendMail({ to: booking.email, subject: `Booking Received – ${booking.bookingId || booking._id}`, html: customerHtml }),
  ]);
}

/**
 * New enquiry (Components/BookingForm/BookingForm.jsx, the package-page
 * "Book Your Adventure" modal) → admin + customer emails. Mirrors
 * sendBookingEmails() above; kept separate since Inquiry and Booking are
 * different collections with different field shapes.
 */
export async function sendInquiryEmails(inquiry) {
  const travelerLine = [
    inquiry.adults ? `${inquiry.adults} Adult(s)` : null,
    inquiry.children ? `${inquiry.children} Child(ren)` : null,
    inquiry.seniors ? `${inquiry.seniors} Senior(s)` : null,
  ].filter(Boolean).join(' · ') || (inquiry.travelers ? `${inquiry.travelers} traveler(s)` : 'Not specified');

  const addOns = [
    inquiry.pickup ? 'Airport Pickup' : null,
    inquiry.guide ? 'Local Guide' : null,
    inquiry.insurance ? 'Travel Insurance' : null,
    inquiry.wheelchair ? 'Wheelchair Assistance' : null,
  ].filter(Boolean);

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px">
      <h2 style="color:#2c3e50">New Package Enquiry</h2>
      <p><b>ID:</b> ${inquiry._id}</p>
      <p><b>Package:</b> ${inquiry.packageTitle || '—'}</p>
      <p><b>Destination:</b> ${inquiry.destination || '—'}</p>
      <hr/>
      <p><b>Name:</b> ${inquiry.name}</p>
      <p><b>Email:</b> ${inquiry.email}</p>
      <p><b>Phone:</b> ${inquiry.phone}</p>
      <hr/>
      <p><b>Travel Date:</b> ${inquiry.travelDate ? new Date(inquiry.travelDate).toLocaleDateString() : 'Flexible'}</p>
      <p><b>Travelers:</b> ${travelerLine}</p>
      <p><b>Room Preference:</b> ${inquiry.roomPreference || 'No preference'}</p>
      <p><b>Meal Preference:</b> ${inquiry.mealPreference || 'No preference'}</p>
      ${addOns.length ? `<p><b>Requested Add-ons:</b> ${addOns.join(', ')}</p>` : ''}
      <p><b>Estimated Total:</b> ${inquiry.totalPrice ? `₹${inquiry.totalPrice.toLocaleString('en-IN')}` : 'On request'}</p>
      <p><b>Message:</b> ${inquiry.message || '—'}</p>
      <br/>
      <a href="${frontendUrl()}/admin/enquiries"
         style="background:#3498db;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px">
        View in Dashboard
      </a>
    </div>`;

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px">
      <h2 style="color:#2c3e50">Thank You for Your Enquiry!</h2>
      <p>Dear ${inquiry.name},</p>
      <p>We received your enquiry for <b>${inquiry.packageTitle || inquiry.destination}</b>.</p>
      <p>Reference: <b>${inquiry._id}</b></p>
      <div style="background:#f8f9fa;padding:16px;border-radius:8px;margin:16px 0">
        <p><b>Destination:</b> ${inquiry.destination || '—'}</p>
        <p><b>Travel Date:</b> ${inquiry.travelDate ? new Date(inquiry.travelDate).toLocaleDateString() : 'Flexible'}</p>
        <p><b>Travelers:</b> ${travelerLine}</p>
        ${inquiry.totalPrice ? `<p><b>Estimated Total:</b> ₹${inquiry.totalPrice.toLocaleString('en-IN')}</p>` : ''}
      </div>
      <p>Our travel expert will contact you within <b>24 hours</b> to confirm details and finalize your itinerary.</p>
      <p>📞 +91 98765 43210 &nbsp;|&nbsp; 📧 support@desivdesi.com</p>
      <p style="color:#999;font-size:.85em">Thank you for choosing Desi V Desi Tours!</p>
    </div>`;

  await Promise.all([
    sendMail({ to: adminEmail(), subject: `New Enquiry: ${inquiry.packageTitle || inquiry.destination || inquiry._id}`, html: adminHtml }),
    sendMail({ to: inquiry.email, subject: `We received your enquiry – ${inquiry.packageTitle || 'Desivdesi'}`, html: customerHtml }),
  ]);
}

/**
 * Status change → customer email
 */
export async function sendStatusUpdateEmail(booking) {
  const colors = { pending:'#f39c12', confirmed:'#27ae60', responded:'#3498db', closed:'#95a5a6', rejected:'#e74c3c' };
  const msgs   = {
    pending  : 'Your enquiry is pending review.',
    confirmed: 'Great news! Your booking has been confirmed.',
    responded: 'Our team has responded to your enquiry.',
    closed   : 'This enquiry has been closed.',
    rejected : 'We regret we cannot process this booking at this time.',
  };

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px">
      <h2 style="color:#2c3e50">Booking Status Update</h2>
      <p>Dear ${booking.fullName},</p>
      <div style="background:${colors[booking.status] || '#888'};color:#fff;padding:12px 16px;border-radius:8px;margin:16px 0">
        <b>Status: ${(booking.status || '').toUpperCase()}</b>
      </div>
      <p>${msgs[booking.status] || ''}</p>
      <div style="background:#f8f9fa;padding:16px;border-radius:8px">
        <p><b>Booking ID:</b> ${booking.bookingId || booking._id}</p>
        <p><b>Package:</b> ${booking.packageName}</p>
        <p><b>Destination:</b> ${booking.destination}</p>
      </div>
      <p>Questions? 📞 +91 98765 43210 &nbsp;|&nbsp; 📧 support@desivdesi.com</p>
    </div>`;

  await sendMail({ to: booking.email, subject: `Booking Update – ${booking.bookingId || booking._id}`, html });
}

/**
 * OTP email
 */
export async function sendOtpEmail(email, otp) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:400px;text-align:center">
      <h2 style="color:#2c3e50">Your OTP</h2>
      <div style="font-size:2.5rem;font-weight:700;letter-spacing:8px;color:#E8813A;margin:24px 0">${otp}</div>
      <p>Valid for <b>5 minutes</b>. Do not share this with anyone.</p>
      <p style="color:#999;font-size:.85em">Desi V Desi Tours</p>
    </div>`;
  await sendMail({ to: email, subject: 'Your OTP – Desi V Desi', html });
}

// module.exports = { sendBookingEmails, sendStatusUpdateEmail, sendOtpEmail, sendMail };
