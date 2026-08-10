import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./Models/UserModel.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    if (!process.env.ADMIN_SEED_EMAIL || !process.env.ADMIN_SEED_PASSWORD) {
      console.error(
        "ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD must be set in your .env before running this script."
      );
      return process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = process.env.ADMIN_SEED_EMAIL;

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email);
      return process.exit();
    }

    // NOTE: do NOT hash this manually. Models/UserModel.js has a pre('save')
    // hook that hashes any modified `password` field automatically — hashing
    // it here too would double-hash it and permanently break login (the
    // stored hash would be bcrypt(bcrypt(plaintext)), which bcrypt.compare()
    // against the real plaintext password can never match).
    const admin = new User({
      name: process.env.ADMIN_SEED_NAME || "Admin",
      email: adminEmail,
      password: process.env.ADMIN_SEED_PASSWORD,
      isAdmin: true,
      role: "superadmin",
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
      isAdmin: "true",
      role: "admin",
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
