import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateAvatar,
} from "../Controllers/UserController.js";
import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserProfile);
router.put("/me/avatar", protect, updateAvatar);

export default router;
