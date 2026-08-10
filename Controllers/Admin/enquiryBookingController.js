import asyncHandler from 'express-async-handler';
import Booking from '../../Models/Booking.js';
import Inquiry from '../../Models/InquiryModel.js';

// GET /api/admin/enquiries?status=&page=&limit=&search=
// A single unified inbox combining Booking (which doubles as our enquiry
// record — see Message/enquiryType/status fields) and the older, simpler
// Inquiry collection (package-page "quick enquiry" widget).
export const getUnifiedInbox = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20, search = '' } = req.query;

  const bookingFilter = {};
  const inquiryFilter = {};
  if (status) {
    bookingFilter.status = status;
    // map Inquiry's smaller status set onto the unified pipeline
    const inquiryStatusMap = { pending: 'new', responded: 'contacted', contacted: 'contacted', confirmed: 'contacted', closed: 'closed' };
    if (Object.values(inquiryStatusMap).includes(status) || ['new', 'contacted', 'closed'].includes(status)) {
      inquiryFilter.status = status;
    } else {
      inquiryFilter._id = null; // no match, keep this source out of results for this status
    }
  }
  if (search) {
    const re = new RegExp(search, 'i');
    bookingFilter.$or = [{ fullName: re }, { email: re }, { mobile: re }, { destination: re }];
    inquiryFilter.$or = [{ name: re }, { email: re }, { phone: re }, { destination: re }];
  }

  const [bookings, inquiries] = await Promise.all([
    Booking.find(bookingFilter).populate('assignedAgent', 'name email').sort({ createdAt: -1 }).lean(),
    Inquiry.find(inquiryFilter).sort({ createdAt: -1 }).lean(),
  ]);

  const unified = [
    ...bookings.map((b) => ({
      source: 'booking',
      id: b._id,
      name: b.fullName,
      email: b.email,
      phone: b.mobile,
      destination: b.destination,
      packageName: b.packageName,
      status: b.status,
      assignedAgent: b.assignedAgent || null,
      notes: b.notes || '',
      timeline: b.timeline || [],
      createdAt: b.createdAt,
    })),
    ...inquiries.map((i) => ({
      source: 'inquiry',
      id: i._id,
      name: i.name,
      email: i.email,
      phone: i.phone,
      destination: i.destination,
      packageName: i.packageTitle,
      status: i.status,
      assignedAgent: null,
      notes: i.message || '',
      timeline: [],
      createdAt: i.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = unified.length;
  const start = (page - 1) * limit;
  const paged = unified.slice(start, start + Number(limit));

  res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), items: paged });
});

// PUT /api/admin/enquiries/:source/:id/assign  — agent assignment (booking-source only)
export const assignAgent = asyncHandler(async (req, res) => {
  const { source, id } = req.params;
  const { agentId } = req.body;
  if (source !== 'booking') {
    return res.status(400).json({ success: false, message: 'Agent assignment is only supported for bookings.' });
  }
  const booking = await Booking.findByIdAndUpdate(id, { assignedAgent: agentId }, { new: true });
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

  await req.audit?.({ action: 'assign_agent', module: 'enquiries', targetId: id, after: { agentId } });
  res.json({ success: true, message: 'Agent assigned.', booking });
});

// PUT /api/admin/enquiries/:source/:id/status
export const updateInboxStatus = asyncHandler(async (req, res) => {
  const { source, id } = req.params;
  const { status, note } = req.body;

  if (source === 'booking') {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    const before = booking.status;
    booking.status = status;
    booking.timeline = booking.timeline || [];
    booking.timeline.push({
      status,
      note: note || '',
      by: req.user?.name || 'admin',
      at: new Date(),
    });
    await booking.save();
    await req.audit?.({ action: 'status_change', module: 'enquiries', targetId: id, before: { status: before }, after: { status } });
    return res.json({ success: true, message: 'Status updated.', booking });
  }

  const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
  if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
  await req.audit?.({ action: 'status_change', module: 'enquiries', targetId: id, after: { status } });
  res.json({ success: true, message: 'Status updated.', inquiry });
});

// POST /api/admin/enquiries/:source/:id/notes — append a note to the timeline
export const addNote = asyncHandler(async (req, res) => {
  const { source, id } = req.params;
  const { note } = req.body;
  if (!note) return res.status(400).json({ success: false, message: 'note is required.' });

  if (source === 'booking') {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    booking.timeline = booking.timeline || [];
    booking.timeline.push({ note, by: req.user?.name || 'admin', at: new Date() });
    await booking.save();
    return res.json({ success: true, message: 'Note added.', booking });
  }

  return res.status(400).json({ success: false, message: 'Notes/timeline are only supported for bookings.' });
});

// POST /api/admin/enquiries/bulk — bulk status update / bulk agent assignment
export const bulkAction = asyncHandler(async (req, res) => {
  const { items, action, value } = req.body; // items: [{ source, id }], action: 'status' | 'assign'
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ success: false, message: 'items must be a non-empty array.' });
  }

  const bookingIds = items.filter((i) => i.source === 'booking').map((i) => i.id);
  const inquiryIds = items.filter((i) => i.source === 'inquiry').map((i) => i.id);

  if (action === 'status') {
    if (bookingIds.length) await Booking.updateMany({ _id: { $in: bookingIds } }, { status: value });
    if (inquiryIds.length) await Inquiry.updateMany({ _id: { $in: inquiryIds } }, { status: value });
  } else if (action === 'assign') {
    if (bookingIds.length) await Booking.updateMany({ _id: { $in: bookingIds } }, { assignedAgent: value });
  } else {
    return res.status(400).json({ success: false, message: "action must be 'status' or 'assign'." });
  }

  await req.audit?.({ action: `bulk_${action}`, module: 'enquiries', after: { items, value } });
  res.json({ success: true, message: `Bulk ${action} applied to ${items.length} item(s).` });
});
