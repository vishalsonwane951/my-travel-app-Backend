// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import cookieParser from "cookie-parser";
// import PackagesRoutes from './Routes/PackagesRoutes.js';
// import PackagesDetailsRoutes from './Routes/PackageDetailsRoutes..js'
// import Domestic from '../src/Dasboard/Domestic.jsx';
// import DomesticRoutes from './Routes/DomesticRoutes.js'
// import InternationalRoutes from './Routes/InternationalRoutes.js'
// import explorePackageRoutes from './Routes/ExplorePackageRoutes.js';
// import userRoutes from "./Routes/UserRoutes.js";
// import bookingRoutes from './Routes/BookingRoutes.js';
// import { firewall } from './Middlewares/firewall.js';
// import authRoutes from './Routes/AuthRoutes.js';
// import { errorHandler } from './Middlewares/firewall.js';

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 4000;

// // Middleware
// app.use(cors({
//   origin: ["http://localhost:5173", "https://my-travel-app-frontend-i2dh.vercel.app"],
//   methods: ["GET","POST","PUT","DELETE","OPTIONS"],
//   allowedHeaders: ["Content-Type","Authorization"],
//   credentials: false
// }));
// app.use(express.urlencoded({ extended: true })); 
// app.use(express.json()); // parses incoming JSON requests

// // app.use(firewall);


// app.use(cors({
//   origin: "http://localhost:5173",  // frontend URL
//   credentials: true,
// }));



// // MongoDB Connection
// // mongoose.connect(process.env.MONGO_URI)
// mongoose.connect('mongodb+srv://vishalsonwane951:Vishal%40123@cluster1.ijaly4c.mongodb.net/Desi_V_Desi?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ Connected to MongoDB Atlas'))
// .catch(err => console.error('❌ MongoDB connection error:', err));  //uname: ShreyaGagare27 //pass:Shreya@72

// // Routes
  // app.use('/axios/maharashtra-cards', maharashtraRoutes);
  // app.use('/axios/travellers-choice', maharashtraRoutes);
  // app.use('/axios/family-friendly',maharashtraRoutes)
  // app.use('/axios/hidden-games',maharashtraRoutes)
  // app.use('/axios/outdoors',maharashtraRoutes)
  // app.use('/axios/arts&theatre',maharashtraRoutes)
  // app.use('/axios/night-life',maharashtraRoutes)



// // Packagess Route

// app.use('/axios/adventure-tours',PackagesRoutes)

// // PackageDetails

// app.use('/axios/maharashtra-PackageDetails',PackagesDetailsRoutes)

// // Domestic
// app.use('/axios/maharashtra-domestic',DomesticRoutes)

// // International
// app.use('/axios/International-tours',InternationalRoutes)

// //Museums
// app.use('/axios/maharashtra-museums', maharashtraRoutes);

// //Explore Packages
// app.use('/axios/explore-packages', explorePackageRoutes);

// //user

// app.use("/axios/users", userRoutes);

// //Bookings

// app.use("/axios/bookings", bookingRoutes);

// //otp

// // Routes
// // app.use("/axios/auth", authRoutes);

// // Health check
// app.get("/health", (req, res) => res.json({ ok: true }));

// // Error handler (last)
// // app.use(errorHandler);



// // Start Server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });




// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import cookieParser from "cookie-parser";

// import bookingRoutes from './Routes/BookingRoutes.js';
// // ... import other routes

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 4000;

// // ✅ CORS (single correct setup)
// app.use(cors({
//   origin: ["http://localhost:5173", "https://my-travel-app-frontend-i2dh.vercel.app"],
//   methods: ["GET","POST","PUT","DELETE","OPTIONS"],
//   allowedHeaders: ["Content-Type","Authorization"],
//   credentials: true
// }));

// // ✅ Parsers
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cookieParser());

// // ✅ Routes
// app.use("/axios/bookings", bookingRoutes);
// // ... other routes

// // ✅ Health check
// app.get("/health", (req, res) => res.json({ ok: true }));

// // ✅ MongoDB connection
// mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://username:password@cluster1.mongodb.net/Desi_V_Desi', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('✅ Connected to MongoDB Atlas'))
// .catch(err => console.error('❌ MongoDB connection error:', err));

// // ✅ Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });















import 'dotenv/config';
import maharashtraRoutes from './Routes/MaharashtraRoutes.js';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import PackagesRoutes from './Routes/PackagesRoutes.js'
import userRoutes from "./Routes/UserRoutes.js";
import bookingRoutes from "./Routes/BookingRoutes.js";
import DomesticRoutes from './Routes/DomesticRoutes.js'
import InternationalRoutes from './Routes/InternationalRoutes.js'
import ExplorePackageRoutes from './Routes/ExplorePackageRoutes.js'


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS
app.use(cors({
  origin: ["http://localhost:5173", "https://my-travel-app-frontend-i2dh.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "cache-control"]
}));




// ✅ Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


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


// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
