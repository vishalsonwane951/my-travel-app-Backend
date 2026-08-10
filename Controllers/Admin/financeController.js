import asyncHandler from 'express-async-handler';
import Invoice from '../../Models/Invoice.js';
import Payment from '../../Models/Payment.js';
import Expense from '../../Models/Expense.js';
import Commission from '../../Models/Commission.js';
import Booking from '../../Models/Booking.js';
import { generateInvoicePdf } from '../../Services/invoicePdfService.js';

// ── INVOICES ──────────────────────────────────────────────────────────────

// POST /api/admin/finance/invoices
export const createInvoice = asyncHandler(async (req, res) => {
  const { bookingId, lineItems, taxRate, discount, dueDate } = req.body;
  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

  const subtotal = (lineItems || []).reduce((s, li) => s + li.quantity * li.unitPrice, 0);
  const items = (lineItems || []).map((li) => ({ ...li, amount: li.quantity * li.unitPrice }));

  const invoice = await Invoice.create({
    booking: booking._id,
    customer: { name: booking.fullName, email: booking.email, mobile: booking.mobile },
    lineItems: items,
    subtotal,
    taxRate: taxRate ?? 5,
    discount: discount ?? 0,
    dueDate,
    issuedBy: req.user?._id,
  });

  try {
    const pdfUrl = await generateInvoicePdf(invoice);
    invoice.pdfUrl = pdfUrl;
    await invoice.save();
  } catch (err) {
    console.error('[Invoice PDF]', err.message);
  }

  await req.audit?.({ action: 'create', module: 'finance', targetId: invoice._id, after: invoice.toObject() });
  res.status(201).json({ success: true, message: 'Invoice created.', invoice });
});

// GET /api/admin/finance/invoices
export const listInvoices = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = status ? { status } : {};
  const [invoices, total] = await Promise.all([
    Invoice.find(filter).populate('booking', 'bookingId destination fullName').sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit)),
    Invoice.countDocuments(filter),
  ]);
  res.json({ success: true, invoices, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET /api/admin/finance/invoices/:id
export const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate('booking');
  if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  res.json({ success: true, invoice });
});

// PUT /api/admin/finance/invoices/:id/regenerate-pdf
export const regenerateInvoicePdf = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  const pdfUrl = await generateInvoicePdf(invoice);
  invoice.pdfUrl = pdfUrl;
  await invoice.save();
  res.json({ success: true, invoice });
});

// ── PAYMENTS (manual/offline entries — Razorpay flow lives in paymentController.js) ──

// GET /api/admin/finance/payments
export const listPayments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = status ? { status } : {};
  const [payments, total] = await Promise.all([
    Payment.find(filter).populate('booking', 'bookingId fullName destination').sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit)),
    Payment.countDocuments(filter),
  ]);
  res.json({ success: true, payments, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// POST /api/admin/finance/payments — record an offline/manual payment (cash, bank transfer, etc.)
export const recordManualPayment = asyncHandler(async (req, res) => {
  const { bookingId, invoiceId, amount, type, method, notes } = req.body;
  if (!bookingId || !amount) {
    return res.status(400).json({ success: false, message: 'bookingId and amount are required.' });
  }
  const payment = await Payment.create({
    booking: bookingId, invoice: invoiceId, amount, type: type || 'full',
    method: method || 'manual', status: 'success', notes,
  });

  if (invoiceId) {
    const invoice = await Invoice.findById(invoiceId);
    if (invoice) {
      invoice.amountPaid += Number(amount);
      await invoice.save();
    }
  }

  await req.audit?.({ action: 'create', module: 'finance', targetId: payment._id, after: payment.toObject() });
  res.status(201).json({ success: true, message: 'Payment recorded.', payment });
});

// ── EXPENSES ──────────────────────────────────────────────────────────────

// GET /api/admin/finance/expenses
export const listExpenses = asyncHandler(async (req, res) => {
  const { category, from, to, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (from || to) filter.date = { ...(from && { $gte: new Date(from) }), ...(to && { $lte: new Date(to) }) };
  const [expenses, total] = await Promise.all([
    Expense.find(filter).sort({ date: -1 }).skip((page - 1) * limit).limit(Number(limit)),
    Expense.countDocuments(filter),
  ]);
  res.json({ success: true, expenses, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// POST /api/admin/finance/expenses
export const createExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.create({ ...req.body, recordedBy: req.user?._id });
  await req.audit?.({ action: 'create', module: 'finance', targetId: expense._id, after: expense.toObject() });
  res.status(201).json({ success: true, message: 'Expense recorded.', expense });
});

// DELETE /api/admin/finance/expenses/:id
export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) return res.status(404).json({ success: false, message: 'Expense not found.' });
  await req.audit?.({ action: 'delete', module: 'finance', targetId: req.params.id });
  res.json({ success: true, message: 'Expense deleted.' });
});

// ── COMMISSIONS ───────────────────────────────────────────────────────────

// GET /api/admin/finance/commissions
export const listCommissions = asyncHandler(async (req, res) => {
  const { status, agentId } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (agentId) filter.agent = agentId;
  const commissions = await Commission.find(filter).populate('agent', 'name email').populate('booking', 'bookingId destination').sort({ createdAt: -1 });
  res.json({ success: true, commissions });
});

// PUT /api/admin/finance/commissions/:id/status
export const updateCommissionStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const commission = await Commission.findByIdAndUpdate(
    req.params.id,
    { status, ...(status === 'paid' && { paidAt: new Date() }) },
    { new: true }
  );
  if (!commission) return res.status(404).json({ success: false, message: 'Commission not found.' });
  await req.audit?.({ action: 'status_change', module: 'finance', targetId: commission._id, after: { status } });
  res.json({ success: true, commission });
});

// ── REPORTS ───────────────────────────────────────────────────────────────

// GET /api/admin/finance/reports/pnl?from=&to=
export const getProfitAndLoss = asyncHandler(async (req, res) => {
  const from = req.query.from ? new Date(req.query.from) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const to = req.query.to ? new Date(req.query.to) : new Date();

  const [revenueAgg, expenseAgg, expenseByCategory] = await Promise.all([
    Payment.aggregate([
      { $match: { status: 'success', type: { $ne: 'refund' }, createdAt: { $gte: from, $lte: to } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Expense.aggregate([
      { $match: { date: { $gte: from, $lte: to } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Expense.aggregate([
      { $match: { date: { $gte: from, $lte: to } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]),
  ]);

  const revenue = revenueAgg[0]?.total || 0;
  const expenses = expenseAgg[0]?.total || 0;

  res.json({
    success: true,
    period: { from, to },
    pnl: {
      revenue,
      expenses,
      netProfit: +(revenue - expenses).toFixed(2),
      expenseByCategory: expenseByCategory.map((e) => ({ category: e._id, total: e.total })),
    },
  });
});

// GET /api/admin/finance/reports/cashflow?months=6
export const getCashFlow = asyncHandler(async (req, res) => {
  const months = Math.min(parseInt(req.query.months) || 6, 24);
  const since = new Date();
  since.setMonth(since.getMonth() - (months - 1));
  since.setDate(1);

  const [inflow, outflow] = await Promise.all([
    Payment.aggregate([
      { $match: { status: 'success', type: { $ne: 'refund' }, createdAt: { $gte: since } } },
      { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, total: { $sum: '$amount' } } },
    ]),
    Expense.aggregate([
      { $match: { date: { $gte: since } } },
      { $group: { _id: { y: { $year: '$date' }, m: { $month: '$date' } }, total: { $sum: '$amount' } } },
    ]),
  ]);

  res.json({ success: true, inflow, outflow });
});

// GET /api/admin/finance/reports/tax?from=&to=  — GST collected on issued invoices
export const getTaxReport = asyncHandler(async (req, res) => {
  const from = req.query.from ? new Date(req.query.from) : new Date(new Date().getFullYear(), 0, 1);
  const to = req.query.to ? new Date(req.query.to) : new Date();

  const agg = await Invoice.aggregate([
    { $match: { createdAt: { $gte: from, $lte: to } } },
    { $group: { _id: null, totalTax: { $sum: '$taxAmount' }, totalSubtotal: { $sum: '$subtotal' }, totalInvoices: { $sum: 1 } } },
  ]);

  res.json({ success: true, period: { from, to }, tax: agg[0] || { totalTax: 0, totalSubtotal: 0, totalInvoices: 0 } });
});

// GET /api/admin/finance/export/csv?type=invoices|payments|expenses
export const exportCsv = asyncHandler(async (req, res) => {
  const { type = 'invoices' } = req.query;
  let rows = [];
  let header = [];

  if (type === 'invoices') {
    header = ['invoiceNumber', 'customer', 'total', 'amountPaid', 'balanceDue', 'status', 'createdAt'];
    const invoices = await Invoice.find().sort({ createdAt: -1 }).lean();
    rows = invoices.map((i) => [i.invoiceNumber, i.customer?.name, i.total, i.amountPaid, i.balanceDue, i.status, i.createdAt.toISOString()]);
  } else if (type === 'payments') {
    header = ['id', 'booking', 'amount', 'type', 'method', 'status', 'createdAt'];
    const payments = await Payment.find().sort({ createdAt: -1 }).lean();
    rows = payments.map((p) => [p._id, p.booking, p.amount, p.type, p.method, p.status, p.createdAt.toISOString()]);
  } else if (type === 'expenses') {
    header = ['id', 'category', 'description', 'amount', 'vendor', 'date'];
    const expenses = await Expense.find().sort({ date: -1 }).lean();
    rows = expenses.map((e) => [e._id, e.category, e.description, e.amount, e.vendor || '', e.date.toISOString()]);
  } else {
    return res.status(400).json({ success: false, message: 'type must be invoices, payments or expenses.' });
  }

  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [header.join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${type}.csv"`);
  res.send(csv);
});
