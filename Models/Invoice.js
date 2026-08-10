import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      mobile: { type: String },
    },
    lineItems: [lineItemSchema],
    subtotal: { type: Number, required: true, default: 0 },
    taxRate: { type: Number, default: 5 }, // % GST
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true, default: 0 },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'issued', 'partially_paid', 'paid', 'cancelled'],
      default: 'issued',
    },
    pdfUrl: { type: String, default: '' }, // Cloudinary/local URL to the generated PDF
    dueDate: { type: Date },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

invoiceSchema.pre('save', function (next) {
  if (!this.invoiceNumber) {
    const rand = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.invoiceNumber = `INV-${new Date().getFullYear()}-${rand}`;
  }
  this.taxAmount = +((this.subtotal - this.discount) * (this.taxRate / 100)).toFixed(2);
  this.total = +(this.subtotal - this.discount + this.taxAmount).toFixed(2);
  this.balanceDue = +(this.total - this.amountPaid).toFixed(2);
  if (this.balanceDue <= 0) this.status = 'paid';
  else if (this.amountPaid > 0) this.status = 'partially_paid';
  next();
});

invoiceSchema.index({ createdAt: -1 });

export default mongoose.model('Invoice', invoiceSchema);
