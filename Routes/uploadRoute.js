import express from "express";
import { uploadImageByTitle, getAllTitles, uploadGalleryImages } from "../Controllers/UploadController.js";
import upload from "../Middlewares/multer.js"; // ✅ custom multer config

const router = express.Router();

// ✅ Get all titles
router.get("/titles", getAllTitles);

// ✅ Upload multiple images by title
router.post("/upload/:title", upload.single("image", 10), uploadImageByTitle);


//Explore Packages


// Multiple images upload route
router.put("/upload-gallery/:id", upload.array("images", 10), uploadGalleryImages);

export default router;
    