// utils/backfillPartBC.js
//
// ONE-TIME MIGRATION SCRIPT — run once after deploying the Part B/C changes.
//
// Why this is needed:
//  - User.referralCode is only generated inside the pre('save') hook
//    (Models/UserModel.js). Any user document that existed BEFORE this
//    change was deployed will have no referralCode until their document is
//    next saved — which may never happen for an inactive account. Referral
//    links and the agent portal need every user to have one.
//  - Package.seatsLeft defaults to 30 for new documents, but Mongoose
//    defaults only apply when a document is created, not retroactively to
//    documents already sitting in the collection. Existing packages will
//    read back as seatsLeft: undefined until backfilled, which the
//    frontend now correctly treats as "unknown" (no urgency badge shown) —
//    but you'll want real numbers for existing inventory.
//
// USAGE (run once, after setting MONGODB_URI in your .env):
//   node utils/backfillPartBC.js
//
// Idempotent — safe to re-run; it only touches documents missing the field.

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../Models/UserModel.js';
import Package from '../Models/PackagesModel.js';

async function backfillReferralCodes() {
  const usersMissingCode = await User.find({ referralCode: { $exists: false } });
  let updated = 0;
  for (const user of usersMissingCode) {
    // .save() re-runs the pre('save') hook, which generates a unique code
    await user.save();
    updated += 1;
  }
  console.log(`[backfill] referralCode: updated ${updated} user(s)`);
  return updated;
}

async function backfillSeatsLeft() {
  const result = await Package.updateMany(
    { seatsLeft: { $exists: false } },
    { $set: { seatsLeft: 30 } }
  );
  console.log(`[backfill] seatsLeft: updated ${result.modifiedCount} package(s) to the default of 30`);
  return result.modifiedCount;
}

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set — aborting.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected. Running Part B/C backfill...\n');

  await backfillReferralCodes();
  await backfillSeatsLeft();

  console.log('\nDone. Review Package.seatsLeft values and adjust any that should differ from the default 30.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
