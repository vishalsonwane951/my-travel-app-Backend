import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import maharashtraRoutes from './Routes/MaharashtraRoutes.js';
import PackagesRoutes from './Routes/PackagesRoutes.js';
import PackagesDetailsRoutes from './Routes/PackageDetailsRoutes..js'
// import Domestic from '../src/Dasboard/Domestic.jsx';
import DomesticRoutes from './Routes/DomesticRoutes.js'
import InternationalRoutes from './Routes/InternationalRoutes.js'
import explorePackageRoutes from './Routes/ExplorePackageRoutes.js';
import userRoutes from "./Routes/UserRoutes.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
mongoose.connect('mongodb+srv://vishalsonwane951:Vishal%40123@cluster1.ijaly4c.mongodb.net/Desi_V_Desi?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));  //uname: ShreyaGagare27 //pass:Shreya@72

// Routes
app.use('/api/maharashtra-cards', maharashtraRoutes);
app.use('/api/travellers-choice', maharashtraRoutes);
app.use('/api/family-friendly',maharashtraRoutes)
app.use('/api/hidden-games',maharashtraRoutes)
app.use('/api/outdoors',maharashtraRoutes)
app.use('/api/arts&theatre',maharashtraRoutes)
app.use('/api/night-life',maharashtraRoutes)



// Packagess Route

app.use('/api/adventure-tours',PackagesRoutes)

// PackageDetails

app.use('/api/maharashtra-PackageDetails',PackagesDetailsRoutes)

// Domestic
app.use('/api/maharashtra-domestic',DomesticRoutes)

// International
app.use('/api/International-tours',InternationalRoutes)

//Museums
app.use('/api/maharashtra-museums', maharashtraRoutes);

//Explore Packages
app.use('/api/explore-packages', explorePackageRoutes);

//user

app.use("/api/users", userRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
