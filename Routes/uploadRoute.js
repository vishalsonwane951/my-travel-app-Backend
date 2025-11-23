console.log("Upload Routes Loaded");

import express from "express";
import {  getAllTitles, uploadImageById, deleteImageById } from "../Controllers/UploadController.js";
import upload from "../Middlewares/multer.js"; // ✅ custom multer config

const router = express.Router();

// ✅ Get all titles
router.get("/titles", getAllTitles);

// ✅ Upload multiple images by title
router.post("/upload-image/:id", upload.single("image"), uploadImageById);
router.delete("/delete-image/:id", deleteImageById);


//Explore Packages


// Multiple images upload route
// router.post("/upload/:title", upload.single("image"), uploadImageByTitle);

export default router;
    