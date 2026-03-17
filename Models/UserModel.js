import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name    : { type: String, required: [true, 'Name required'], trim: true, maxlength: 80 },
    email   : { type: String, required: [true, 'Email required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    password: { type: String, minlength: 6, select: false },
    mobile  : { type: String, trim: true },
    city    : { type: String, trim: true },
    isAdmin : { type: Boolean, default: false },
    // Cloudinary avatar
    avatar         : { type: String, default: '' },
    avatarPublicId : { type: String, default: '' },
    wishlist : [{ type: mongoose.Schema.Types.ObjectId }],
    otp      : { type: String, select: false },
    otpExpiry: { type: Date,   select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function (c) { return bcrypt.compare(c, this.password); };
userSchema.methods.toJSON = function () {
  const o = this.toObject();
  delete o.password; delete o.otp; delete o.otpExpiry;
  return o;
};

export default mongoose.model('User', userSchema);
