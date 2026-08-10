// utils/migrateDestinationCollections.js
//
// ONE-TIME MIGRATION SCRIPT
// --------------------------------------------------------------------------
// The old Models/PackageDetails.js defined 12 separate Mongoose collections
// (Agra, Andaman, Goa, Kashmir, Kerla, Ladakh, Manali, Ooty, Rahsthan,
// Rishikesh, Sikkim, Udaipur) — one per destination, all with an identical
// shape (title, duration, location, priceRange, highlights, itinerary).
// That model/controller/route was never actually mounted in server.js, so
// nothing in the running app talks to it — but if any of those collections
// still hold data in MongoDB from earlier testing, this script copies every
// document into the single Package model (Models/PackagesModel.js), which is
// what the rest of the app (PackagesRoutes, PackagesController, the frontend
// Packages pages) actually reads from.
//
// This script is idempotent: re-running it will not create duplicates,
// because it matches existing Package docs by (title + destination) before
// inserting.
//
// USAGE (run once, manually, after setting MONGODB_URI in your .env):
//   node utils/migrateDestinationCollections.js
//
// It does NOT delete the old collections — it only reads from them. Drop
// them yourself afterwards once you've confirmed the migrated data looks
// right in the Package collection.
// --------------------------------------------------------------------------

import 'dotenv/config';
import mongoose from 'mongoose';
import Package from '../Models/PackagesModel.js';

const DESTINATIONS = [
  'Agra', 'Andaman', 'Goa', 'Kashmir', 'Kerla', 'Ladakh',
  'Manali', 'Ooty', 'Rahsthan', 'Rishikesh', 'Sikkim', 'Udaipur',
];

// Matches the old baseCardFields shape from the removed Models/PackageDetails.js
const legacySchema = new mongoose.Schema(
  {
    title: String,
    duration: String,
    location: String,
    priceRange: String,
    highlights: String,
    itinerary: String,
  },
  { timestamps: true, strict: false }
);

// Parses a "priceRange" string like "₹15,000 - ₹25,000" or "From ₹9,999" into a number.
function parsePrice(priceRange = '') {
  const match = String(priceRange).match(/[\d,]+/);
  if (!match) return 0;
  return parseInt(match[0].replace(/,/g, ''), 10) || 0;
}

async function migrateOne(destinationName) {
  // Mongoose model names must be unique; reuse if already registered in this run.
  const LegacyModel =
    mongoose.models[`Legacy_${destinationName}`] ||
    mongoose.model(`Legacy_${destinationName}`, legacySchema, destinationName.toLowerCase());

  const legacyDocs = await LegacyModel.find().lean();
  if (!legacyDocs.length) {
    console.log(`  [${destinationName}] no legacy documents found — skipping`);
    return { destination: destinationName, migrated: 0, skipped: 0 };
  }

  let migrated = 0;
  let skipped = 0;

  for (const doc of legacyDocs) {
    const existing = await Package.findOne({
      title: doc.title,
      destination: destinationName,
    });

    if (existing) {
      skipped += 1;
      continue;
    }

    await Package.create({
      title: doc.title,
      location: doc.location || destinationName,
      destination: destinationName,
      type: 'domestic',
      price: parsePrice(doc.priceRange),
      durations: doc.duration ? [doc.duration] : [],
      highlights: doc.highlights ? [doc.highlights] : [],
      description: doc.itinerary || '',
      active: true,
    });
    migrated += 1;
  }

  console.log(`  [${destinationName}] migrated ${migrated}, skipped ${skipped} (already present)`);
  return { destination: destinationName, migrated, skipped };
}

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set — aborting migration.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB. Starting destination-collection migration...\n');

  const results = [];
  for (const dest of DESTINATIONS) {
    results.push(await migrateOne(dest));
  }

  const totalMigrated = results.reduce((s, r) => s + r.migrated, 0);
  const totalSkipped = results.reduce((s, r) => s + r.skipped, 0);

  console.log(`\nDone. Migrated ${totalMigrated} package(s) into the Package collection, skipped ${totalSkipped} already-present.`);
  console.log('Once you have verified the data, you may manually drop the old per-destination collections.');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
