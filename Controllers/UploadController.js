import { MaharashtraAnimation, MaharashtraState, MaharashtraState2 } from "../Models/DomesticModel.js";

// ✅ Fetch all titles

export const getAllTitles = async (req, res) => {
  try {
    // Fetch title from both collections in parallel
    const [titles1, titles2] = await Promise.all([
      MaharashtraState.find({}, "title"),  // only get 'title' field
      MaharashtraState2.find({}, "title")
    ]);

    res.json({ 
      success: true, 
      titles1,   // titles from first collection
      titles2    // titles from second collection
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// export const uploadImageById = async (req, res) => {
//   try {
//     const { id } = req.params; // ✔ Correct ObjectId
//     const file = req.file;     // ✔ Uploaded file

//     console.log("Updating image for ID:", id);

//     if (!file) {
//       return res.status(400).json({ success: false, message: "No image uploaded" });
//     }

//     const newImagePath = `/uploads/${file.filename}`;

//     // 🔥 Update existing document using ObjectId
//     const updatedDoc = await MaharashtraState.findByIdAndUpdate(
//       id,
//       { image: newImagePath },
//       { new: true } // return updated document
//     );

//     if (!updatedDoc) {
//       return res.status(404).json({
//         success: false,
//         message: "Document not found for this ID",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Image updated successfully",
//       data: updatedDoc,
//     });

//   } catch (error) {
//     console.error("Upload Error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


export const uploadImageById = async (req, res) => {
  try {
    const { id } = req.params;   // ✔ Correct ObjectId
    const file = req.file;       // ✔ Uploaded file

    console.log("Updating image for ID:", id);

    if (!file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const newImagePath = `/uploads/${file.filename}`;

    // 🔥 1️⃣ Try update in MaharashtraState
    let updatedDoc = await MaharashtraState.findByIdAndUpdate(
      id,
      { image: newImagePath },
      { new: true }
    );

    // 🔥 2️⃣ If not found → try MaharashtraState2
    if (!updatedDoc) {
      updatedDoc = await MaharashtraState2.findByIdAndUpdate(
        id,
        { image: newImagePath },
        { new: true }
      );
    }

    // 🔥 3️⃣ If still not found → ID doesn't exist
    if (!updatedDoc) {
      return res.status(404).json({
        success: false,
        message: "Document not found in ANY collection",
      });
    }

    // 🔥 4️⃣ Success
    return res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedDoc,
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


//Explore Packages

import { ExploreAgra } from "../Models/ExplorePackageModel.js";

// ✅ Multer middleware setup
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // your upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filenames
  },
});

export const upload = multer({ storage });






// ✅ Controller: Upload or update multiple gallery images
export const uploadGalleryImages = async (req, res) => {
  try {
    const { id } = req.params; // or use `code` instead
    const files = req.files; // multiple files from multer
    const { captions } = req.body; // optional captions array

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No images uploaded" });
    }

    // Find document by ID
    const tour = await ExploreAgra.findById(id);
    if (!tour) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }

    // Convert uploaded files to { img, caption } objects
    const newGallery = files.map((file, index) => ({
      img: `/uploads/${file.filename}`,
      caption: captions && captions[index] ? captions[index] : `Image ${index + 1}`,
    }));

    // ✅ Option 1: Replace existing gallery
    tour.gallery = newGallery;

    // ✅ Option 2 (alternative): Append to existing gallery
    // tour.gallery = [...tour.gallery, ...newGallery];

    const updatedTour = await ExploreAgra.save();

    res.status(200).json({
      success: true,
      message: "Gallery updated successfully",
      data: updatedTour,
    });
  } catch (error) {
    console.error("Gallery Upload Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};




export const deleteImageById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Deleting image with ID:", id);

    if (!id) {
      return res.status(400).json({ success: false, message: "ID is required" });
    }

    const deleted = await MaharashtraState.findByIdAndDelete(id);

    console.log("Deleted document:", deleted);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    res.status(200).json({ success: true, message: "Image deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
