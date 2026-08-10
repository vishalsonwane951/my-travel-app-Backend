import asyncHandler from 'express-async-handler';
import Notification from '../../Models/Notification.js';
import User from '../../Models/UserModel.js';
import { sendPlainEmail } from '../../utils/email.js';

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.json({ success: true, notifications });
});

// POST /api/admin/notifications  — create as draft
export const createNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create({ ...req.body, sentBy: req.user?._id });
  res.status(201).json({ success: true, notification });
});

// POST /api/admin/notifications/:id/send
export const sendNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });
  if (notification.status === 'sent') {
    return res.status(400).json({ success: false, message: 'This notification has already been sent.' });
  }

  let recipients = [];
  if (notification.audience === 'specific_user' && notification.targetUser) {
    const u = await User.findById(notification.targetUser);
    if (u) recipients = [u];
  } else if (notification.audience === 'staff') {
    recipients = await User.find({ role: { $in: ['superadmin', 'operations', 'sales', 'finance', 'content', 'support'] } });
  } else {
    recipients = await User.find({ role: 'customer' });
  }

  let sentCount = 0;
  if (notification.channel === 'email') {
    for (const r of recipients) {
      try {
        await sendPlainEmail?.(r.email, notification.title, notification.message);
        sentCount += 1;
      } catch (err) {
        console.error('[Notification email]', r.email, err.message);
      }
    }
  } else {
    // sms / in_app: no external provider configured yet — counted as queued for the recipient pool
    sentCount = recipients.length;
  }

  notification.status = 'sent';
  notification.sentAt = new Date();
  notification.recipientCount = sentCount;
  await notification.save();

  await req.audit?.({ action: 'send', module: 'notifications', targetId: notification._id, after: { recipientCount: sentCount } });
  res.json({ success: true, message: `Sent to ${sentCount} recipient(s).`, notification });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Notification deleted.' });
});
