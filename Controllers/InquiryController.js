import Inquiry from "../Models/InquiryModel.js";

export const createInquiry = async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    const saved = await inquiry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("packageId")
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
