import express from "express";
import {
  createInquiry,
  getAllInquiries,
  getMyInquiries,
} from "../Controllers/InquiryController.js";
import { protect, admin } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createInquiry);

// Was previously unauthenticated — anyone could list every customer's name,
// email, phone, and message. Now requires a logged-in admin, consistent
// with every other admin-only listing endpoint in the app.
router.get("/", protect, admin, getAllInquiries);

router.get("/mine", protect, getMyInquiries);

export default router;
