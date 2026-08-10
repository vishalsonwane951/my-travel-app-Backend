import express from "express";
import {
  getPackagesByDestination,
  getPackageById,
  createPackage
} from "../Controllers/ExplorePackageController.js";

const router = express.Router();

// GET all packages by destination
router.get("/:location", getPackagesByDestination);

// GET single package
router.get("/:location/:id", getPackageById);

// POST create package (admin)
router.post("/create/Package", createPackage);

export default router;
