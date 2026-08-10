// utils/fixAdminPassword.js
//
// Fixes an admin account created by the OLD, buggy admin.js, which
// double-hashed the password (see admin.js for the full explanation).
// That bug is now fixed for future seeding, but any account already created
// by the old script needs its password reset once.
//
// USAGE:
//   node utils/fixAdminPassword.js <email> <newPassword>
//
// Example:
//   node utils/fixAdminPassword.js vishalsonwane951@gmail.com Vishal@123

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../Models/UserModel.js';

async function run() {
  const [, , email, newPassword] = process.argv;
  if (!email || !newPassword) {
    console.error('Usage: node utils/fixAdminPassword.js <email> <newPassword>');
    process.exit(1);
  }
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.error(`No user found with email ${email}`);
    process.exit(1);
  }

  // Assigning plaintext here — the pre('save') hook in Models/UserModel.js
  // hashes it exactly once, correctly, since this is a modification.
  user.password = newPassword;
  await user.save();

  console.log(`Password reset for ${user.email} (role: ${user.role}). You can log in with the new password now.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
