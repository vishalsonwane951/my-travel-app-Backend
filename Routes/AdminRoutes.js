import express from "express";
import Inquiry from "../Models/InquiryModel.js";

const router = express.Router();


// Get all inquiries
router.get("/", async (req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  res.json(inquiries);
});

// Update status
router.put("/:id", async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(inquiry);
});

// Delete
router.delete("/:id", async (req, res) => {
  await Inquiry.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
