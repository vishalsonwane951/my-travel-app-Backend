import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

const STAFF_ROLES = ['superadmin', 'operations', 'sales', 'finance', 'content', 'support'];
const LOYALTY_TIERS = ['bronze', 'silver', 'gold', 'platinum'];

const userSchema = new mongoose.Schema(
  {
    name    : { type: String, required: [true, 'Name required'], trim: true, maxlength: 80 },
    email   : { type: String, required: [true, 'Email required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    password: { type: String, minlength: 6, select: false },
    mobile  : { type: String, trim: true },
    city    : { type: String, trim: true },

    // ── RBAC ──────────────────────────────────────────────────────────────
    // 'customer' = normal site user (default), 'agent' = external reselling
    // partner (Part C agent portal). Any value in STAFF_ROLES marks this
    // account as staff/admin. isAdmin below is kept in sync automatically
    // so any existing `if (user.isAdmin)` checks elsewhere keep working.
    role: {
      type: String,
      enum: ['customer', 'agent', ...STAFF_ROLES],
      default: 'customer',
    },
    permissions: { type: [String], default: [] },
    isAdmin : { type: Boolean, default: false }, // legacy/derived — see pre('save') below
    active: { type: Boolean, default: true }, // staff account enable/disable (session control)

    // ── Part C: loyalty / wallet / referral / agent ─────────────────────────
    loyaltyPoints: { type: Number, default: 0 },
    loyaltyTier: { type: String, enum: LOYALTY_TIERS, default: 'bronze' },
    walletBalance: { type: Number, default: 0 },
    referralCode: { type: String, unique: true, sparse: true, uppercase: true, trim: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // Agent-specific
    agentCommissionRate: { type: Number, default: 10 }, // % — used by Commission records
    preferredCurrency: { type: String, default: 'INR' },
    preferredLanguage: { type: String, default: 'en' },

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
  if (!this.referralCode) {
    this.referralCode = `DVD${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  if (!this.isModified('password') || !this.password) {
    // still keep isAdmin derived even if password isn't the change
    if (this.isModified('role')) this.isAdmin = STAFF_ROLES.includes(this.role);
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  if (this.isModified('role')) this.isAdmin = STAFF_ROLES.includes(this.role);
  next();
});
userSchema.methods.comparePassword = function (c) { return bcrypt.compare(c, this.password); };
userSchema.methods.toJSON = function () {
  const o = this.toObject();
  delete o.password; delete o.otp; delete o.otpExpiry;
  return o;
};

userSchema.statics.STAFF_ROLES = STAFF_ROLES;
userSchema.statics.LOYALTY_TIERS = LOYALTY_TIERS;

export default mongoose.model('User', userSchema);
