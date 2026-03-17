// import multer from "multer";

// const storage = multer.memoryStorage(); // store in memory, not file system

// const upload = multer({
//   storage,
//   limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype === "image/jpeg" ||
//       file.mimetype === "image/png" ||
//       file.mimetype === "image/jpg"
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only .jpg, .jpeg, .png files are allowed"), false);
//     }
//   },
// });


// export default upload;
import multer from "multer";

const storage = multer.memoryStorage(); // store file in memory buffer
 const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  }
});
export default upload

