import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./Models/UserModel.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = "shreyagagare2710@gmail.com";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email);
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash("Nilesh@2@05", 10);

    const admin = new User({
      name: "Vishal Sonwane(Admin)",
      email: adminEmail,
      password: hashedPassword,
      role: "true"
    });

    await admin.save();
    console.log("Admin user created:", admin.email);
    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
