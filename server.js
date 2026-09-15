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
// import DomesticRoutes from './Routes/DomesticRoutes.js'
// import InternationalRoutes from './Routes/InternationalRoutes.js'
import favouriteRoutes from './Routes/FavouritesRoutes.js'
import uploadRoutes from './Routes/uploadRoute.js'
// import exploreRoutes from './Routes/ExplorePackageRoutes.js'
import inquiryRoutes from './Routes/InquiryRoute.js'
import adminRoutes from './Routes/Admin/index.js'
import paymentRoutes from './Routes/paymentRoutes.js'
import { razorpayWebhook } from './Controllers/paymentController.js'
import publicContentRoutes from './Routes/PublicContentRoutes.js'
import supportRoutes from './Routes/SupportRoutes.js'
import { scheduleAbandonedEnquiryJob } from './utils/abandonedEnquiryJob.js'
import checkoutRoutes from './Routes/CheckoutRoutes.js'
import partCRoutes from './Routes/PartCRoutes.js'
import tripRoutes from './Routes/trip.js'
import { errorHandler } from './Middlewares/firewall.js';
import placesRoutes from './Routes/PlacesRoutes.js'
import savedRoutes from './Routes/SavedRoute.js'
import QAroutes from './Routes/QAroutes.js';
import Reviewroutes from './Routes/Reviewroutes.js'
import liveStationRoutes from './Routes/IRCTC/liveStationRoutes.js'
import hotelSearchRoutes from './Routes/HotelSearchRoutes.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS
app.use(cors({
  origin: ["https://my-travel-app-frontend-hpi8.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "cache-control"]
}));






// ✅ Razorpay webhook needs the raw request body for signature verification,
// so it MUST be mounted before the global express.json() parser below.
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), razorpayWebhook);

// ✅ Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// To Check server status

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", server: "Desivdesi Backend Running" });
});

//Admin Riutes




app.use('/api/admin', adminRoutes)

// ✅ Routes
app.use("/api/users", userRoutes);

app.use("/api/bookings", bookingRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/content", publicContentRoutes)
app.use("/api/support", supportRoutes)
app.use("/api/checkout", checkoutRoutes)
app.use("/api", partCRoutes)

// app.use("/api/explore", exploreRoutes);
app.use("/api/inquiry", inquiryRoutes);

app.use('/api/maharashtra-cards', maharashtraRoutes);
  // app.use('/api/travellers-choice', maharashtraRoutes);
  // app.use('/api/family-friendly',maharashtraRoutes)
  // app.use('/api/hidden-games',maharashtraRoutes)
  // app.use('/api/outdoors',maharashtraRoutes)
  // app.use('/api/arts&theatre',maharashtraRoutes)
  // app.use('/api/night-life',maharashtraRoutes)
  // app.use('/api/maharashtra-museums', maharashtraRoutes)

  app.use('/api/packages',PackagesRoutes)

// ✅ Health check
app.get("/health", (req, res) => res.json({ ok: true }));

app.use('/api', tripRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/saved', savedRoutes);

// Domestic
//  app.use('/api/maharashtra-domestic',DomesticRoutes)

 // International
//  app.use('/api/International',InternationalRoutes)

 //Explore Packages
//  app.use('/api/explore-packages', PackagesRoutes);

 //favourites
app.use("/api/favourites", favouriteRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Uploads
app.use("/api", uploadRoutes);

// Reviews & Q&A Routes
app.use("/api/reviews", Reviewroutes);
app.use("/api/qa",      QAroutes);

// IRTC

app.use('/api/irctc', liveStationRoutes);
app.use('/api/hotels', hotelSearchRoutes);

// Make uploaded files accessible via URL
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//Error handler middleware
app.use(errorHandler);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Connected to MongoDB Atlas");
  scheduleAbandonedEnquiryJob();
})
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
