import Inquiry from "../Models/InquiryModel.js";
import { sendInquiryEmails } from "../utils/email.js";

// The frontend enquiry form (Components/BookingForm/BookingForm.jsx) sends a
// few fields under different names than the schema uses — normalize them
// here rather than relying on Mongoose to silently drop anything that
// doesn't match a schema path exactly (which is what was happening before:
// `location`, `userId`, and `totalTravelers` were submitted every time and
// discarded every time).
function normalizeInquiryBody(body) {
  const normalized = { ...body };

  if ('location' in normalized && !('destination' in normalized)) {
    normalized.destination = normalized.location;
  }
  delete normalized.location;

  if ('userId' in normalized) {
    normalized.user = normalized.userId || null;
    delete normalized.userId;
  }

  if ('totalTravelers' in normalized) {
    normalized.travelers = normalized.totalTravelers;
    delete normalized.totalTravelers;
  }

  return normalized;
}

export const createInquiry = async (req, res) => {
  try {
    const inquiry = new Inquiry(normalizeInquiryBody(req.body));
    const saved = await inquiry.save();

    // Best-effort — never fails the request if email sending has an issue
    // (see sendMail()'s own try/catch in utils/email.js).
    sendInquiryEmails(saved)
      .then(() => Inquiry.findByIdAndUpdate(saved._id, { confirmationSent: true }))
      .catch((err) => console.error('[Inquiry email]', err.message));

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /inquiry/mine  (auth — current user's own enquiries)
export const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: inquiries.length, inquiries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
