import mongoose from "mongoose";
import ExplorePackage from "../Models/ExplorePackageModel.js";


// Get all packages by destination



export const getPackagesByDestination = async (req, res) => {
  try {
    const { location } = req.params;

    const packages = await ExplorePackage.find({
      location: location,
      isActive: true
    });

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get single package
export const getPackageById = async (req, res) => {
  try {
    const { location, id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid package ID" });
    }

    const pkg = await ExplorePackage.findOne({
      _id: id,
      location: location,
      isActive: true
    });

    if (!pkg) return res.status(404).json({ message: "Package not found" });

    res.status(200).json(pkg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Create package (Admin use)
export const createPackage = async (req, res) => {
  try {
    const newPackage = new ExplorePackage(req.body);
    const saved = await newPackage.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
