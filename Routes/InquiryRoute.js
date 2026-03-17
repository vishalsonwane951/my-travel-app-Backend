import express from "express";
import {
  createInquiry,
  getAllInquiries
} from "../Controllers/InquiryController.js";

const router = express.Router();

router.post("/", createInquiry);

router.get("/", getAllInquiries); // admin panel

export default router;
