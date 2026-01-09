import 'dotenv/config';
import maharashtraRoutes from './Routes/MaharashtraRoutes.js';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import PackagesRoutes from './Routes/PackagesRoutes.js'
import userRoutes from "./Routes/UserRoutes.js";
import bookingRoutes from "./Routes/BookingRoutes.js";
import DomesticRoutes from './Routes/DomesticRoutes.js'
import InternationalRoutes from './Routes/InternationalRoutes.js'
import ExplorePackageRoutes from './Routes/ExplorePackageRoutes.js'
import favouriteRoutes from './Routes/FavouritesRoutes.js'
import uploadRoutes from './Routes/uploadRoute.js'

import { errorHandler } from './Middlewares/firewall.js';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS
app.use(cors({
  origin: ["http://localhost:5173",
    "https://desi-vdesi-tours.netlify.app",
    "https://desivdesi.netlify.app"], //, "https://my-travel-app-frontend-i2dh.vercel.app"
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "cache-control"]
}));




// ✅ Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// To Check server status

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", server: "Desivdesi Backend Running" });
});


// ✅ Routes
app.use("/api/users", userRoutes);

app.use("/api/bookings", bookingRoutes)

app.use('/api/maharashtra-cards', maharashtraRoutes);
  app.use('/api/travellers-choice', maharashtraRoutes);
  app.use('/api/family-friendly',maharashtraRoutes)
  app.use('/api/hidden-games',maharashtraRoutes)
  app.use('/api/outdoors',maharashtraRoutes)
  app.use('/api/arts&theatre',maharashtraRoutes)
  app.use('/api/night-life',maharashtraRoutes)
  app.use('/api/maharashtra-museums', maharashtraRoutes)

  app.use('/api/adventure-tours',PackagesRoutes)

// ✅ Health check
app.get("/health", (req, res) => res.json({ ok: true }));
// Domestic
 app.use('/api/maharashtra-domestic',DomesticRoutes)

 // International
 app.use('/api/International-tours',InternationalRoutes)

 //Explore Packages
 app.use('/api/explore-packages', ExplorePackageRoutes);

 //favourites
app.use("/api/favourites", favouriteRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Uploads
app.use("/api", uploadRoutes);

// Make uploaded files accessible via URL
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//Error handler middleware
app.use(errorHandler);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


