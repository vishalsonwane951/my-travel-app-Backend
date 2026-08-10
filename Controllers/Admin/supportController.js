import asyncHandler from 'express-async-handler';
import SupportTicket from '../../Models/SupportTicket.js';

// Public — customer creates a ticket
export const createTicket = asyncHandler(async (req, res) => {
  const { name, email, subject, category, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'name, email, subject and message are required.' });
  }
  const ticket = await SupportTicket.create({
    name, email, subject, category,
    user: req.user?._id || null,
    replies: [{ from: 'customer', authorName: name, message }],
  });
  res.status(201).json({ success: true, message: 'Support ticket created.', ticket });
});

// Public — customer views their own tickets
export const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find({ $or: [{ user: req.user._id }, { email: req.user.email }] }).sort({ createdAt: -1 });
  res.json({ success: true, tickets });
});

// ── Admin ────────────────────────────────────────────────────────────────

export const listTickets = asyncHandler(async (req, res) => {
  const { status, priority, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  const [tickets, total] = await Promise.all([
    SupportTicket.find(filter).populate('assignedTo', 'name').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
    SupportTicket.countDocuments(filter),
  ]);
  res.json({ success: true, tickets, total, page: Number(page), pages: Math.ceil(total / limit) });
});

export const getTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id).populate('assignedTo', 'name');
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found.' });
  res.json({ success: true, ticket });
});

export const replyToTicket = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ success: false, message: 'message is required.' });
  const ticket = await SupportTicket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found.' });

  ticket.replies.push({ from: 'staff', authorName: req.user?.name || 'Support', message });
  if (ticket.status === 'open') ticket.status = 'in_progress';
  await ticket.save();

  await req.audit?.({ action: 'reply', module: 'support', targetId: ticket._id });
  res.json({ success: true, ticket });
});

export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status, priority, assignedTo } = req.body;
  const update = {};
  if (status) update.status = status;
  if (priority) update.priority = priority;
  if (assignedTo !== undefined) update.assignedTo = assignedTo || null;

  const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found.' });
  await req.audit?.({ action: 'update', module: 'support', targetId: ticket._id, after: update });
  res.json({ success: true, ticket });
});
