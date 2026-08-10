// utils/abandonedEnquiryJob.js
//
// Finds Bookings that have sat in 'pending' status for more than
// ABANDONED_THRESHOLD_HOURS with no reminder yet sent, and emails a single
// gentle nudge. Idempotent — each booking is only ever reminded once
// (reminderSentAt is set immediately after a successful send).
//
// Wired up in server.js with setInterval — no extra cron dependency needed
// for a single-process deployment. For multi-instance deployments, swap this
// for a proper job queue (BullMQ/Agenda) — the logic below is intentionally
// isolated in one function so that swap is a drop-in replacement.

import Booking from '../Models/Booking.js';
import { sendPlainEmail } from './email.js';

const ABANDONED_THRESHOLD_HOURS = 24;

export async function runAbandonedEnquiryJob() {
  const cutoff = new Date(Date.now() - ABANDONED_THRESHOLD_HOURS * 60 * 60 * 1000);

  const stale = await Booking.find({
    status: 'pending',
    reminderSentAt: null,
    createdAt: { $lte: cutoff },
  }).limit(50); // batch cap per run

  if (!stale.length) return { checked: 0, sent: 0 };

  let sent = 0;
  for (const booking of stale) {
    try {
      await sendPlainEmail(
        booking.email,
        `Still thinking about ${booking.destination}?`,
        `Hi ${booking.fullName},\n\nWe noticed you started an enquiry for ${booking.packageName || booking.destination} but haven't confirmed yet. Your quoted price and dates are still on hold for a little while — reply to this email or visit Desivdesi.com to pick up right where you left off.\n\nNeed help? Just reply and our team will get back to you.`
      );
      booking.reminderSentAt = new Date();
      await booking.save();
      sent += 1;
    } catch (err) {
      console.error('[abandonedEnquiryJob] failed to email', booking.email, err.message);
    }
  }

  return { checked: stale.length, sent };
}

// Call once from server.js after the DB connects. Runs immediately, then every hour.
export function scheduleAbandonedEnquiryJob() {
  const run = () => {
    runAbandonedEnquiryJob()
      .then(({ checked, sent }) => {
        if (checked) console.log(`[abandonedEnquiryJob] checked ${checked}, sent ${sent} reminder(s)`);
      })
      .catch((err) => console.error('[abandonedEnquiryJob] run failed:', err.message));
  };
  run();
  setInterval(run, 60 * 60 * 1000); // hourly
}
