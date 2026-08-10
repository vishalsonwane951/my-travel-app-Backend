import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Package from '../Models/PackagesModel.js';
import {deleteFromCloudinary} from '../utils/cloudinary.js';

const cloudImg    = (f) => f ? { images: f.path, imagePublicId: f.filename } : {};
const maybeDelOld = async (doc) => { if (doc.imagePublicId) await deleteFromCloudinary(doc.imagePublicId); };

// Normalizes the create/update request body before it's assigned onto the
// Package document:
//  - inclusions/exclusions arrive as flat semicolon-separated strings (same
//    convention as `highlights`/`durations`) and need to become the nested
//    `inclExcl: { inclusions: [...], exclusions: [...] }` shape the schema
//    actually stores.
//  - lat/long arrive as strings from a <input type="number"> — Mongoose
//    casts numeric strings fine, but an empty string ("" — field left
//    blank) would fail Number casting, so blank values are dropped instead
//    of sent through as "".
export function normalizePackageBody(body) {
  const normalized = { ...body };

  const hasInclusions = 'inclusions' in normalized;
  const hasExclusions = 'exclusions' in normalized;
  if (hasInclusions || hasExclusions) {
    const toList = (v) =>
      typeof v === 'string' ? v.split(';').map((s) => s.trim()).filter(Boolean) : Array.isArray(v) ? v : [];
    normalized.inclExcl = {
      inclusions: toList(normalized.inclusions),
      exclusions: toList(normalized.exclusions),
    };
    delete normalized.inclusions;
    delete normalized.exclusions;
  }

  ['lat', 'long'].forEach((field) => {
    if (normalized[field] === '' || normalized[field] === undefined || normalized[field] === null) {
      delete normalized[field];
    } else {
      normalized[field] = Number(normalized[field]);
    }
  });

  return normalized;
}

// ── Destinations: Agra, Andaman, Goa, Kashmir, Kerala, Ladakh,
//                 Manali, Ooty, Rajasthan, Rishikesh, Sikkim, Udaipur
// Each is just a Package document with `destination` field set.
// GET /packages/destination/:dest
export const getByDestination = asyncHandler(async (req, res) => {

  const { type, destination } = req.params;
  console.log("Params:", req.params);

  const cards = await Package.find({
    type: { $regex: `^${type}$`, $options: "i" },
    location: { $regex: `^${destination}$`, $options: "i" },
    active: true
  });

  // if (!cards.length) {
  //   return res.status(404).json({ message: "No data found" });
  // }
  console.log("Result:", cards);
  
  res.json(cards);

});

// POST /packages/destination/:dest  bulk insert (admin)
export const createByDestination = asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body) || !req.body.length)
    return res.status(400).json({ error: 'Body must be a non-empty array' });
  const docs = req.body.map(d => ({ ...d, destination: req.params.dest }));
  const result = await Package.insertMany(docs);
  res.status(201).json(result);
});

// ── Type-based queries (adventure, family, honeymoon…)
// GET /packages
export const getAllPackages = asyncHandler(async (_req, res) => {
  const pkgs = await Package.find({ active: true }).sort({ featured: -1, createdAt: -1 });
  res.status(200).json(pkgs);
});

// GET /packages/type/:type
export const getPackageByType = asyncHandler(async (req, res) => {
  const { type } = req.params;
  if (!type) return res.status(400).json({ message: 'Package type required' });
  const pkgs = await Package.find({
    type  : { $regex: new RegExp(`^${type.toLowerCase()}$`, 'i') },
    active: true,
  });
  res.status(200).json(pkgs);
});

// GET /packages/cards  (title, location, type, rating, images, durations only)
export const getPackageCards = asyncHandler(async (_req, res) => {
  const pkgs = await Package.find({ active: true })
    .select('title location type rating images durations price strikePrice');
  res.status(200).json(pkgs);
});

// GET /packages/:id
export const getPackageById = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) return res.status(404).json({ message: 'Package not found' });
  res.json(pkg);
});

// GET /packages/:typeOrId
// '/:type' and '/:id' were previously registered as two separate single-segment
// routes, so '/:type' (registered first) silently swallowed every request meant
// for '/:id' — a Mongo ObjectId would never reach getPackageById. This single
// handler disambiguates: a 24-char hex ObjectId goes to getPackageById, anything
// else is treated as a package type.
export const getPackageByTypeOrId = asyncHandler(async (req, res) => {
  const { typeOrId } = req.params;
  if (mongoose.Types.ObjectId.isValid(typeOrId) && String(new mongoose.Types.ObjectId(typeOrId)) === typeOrId) {
    const pkg = await Package.findById(typeOrId);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    return res.json(pkg);
  }
  const pkgs = await Package.find({
    type: { $regex: new RegExp(`^${typeOrId.toLowerCase()}$`, 'i') },
    active: true,
  });
  res.status(200).json(pkgs);
});

// POST /packages  (admin)
export const createPackage = asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body) && typeof req.body === 'object') {
    // single object
    const pkg = await Package.create({ ...normalizePackageBody(req.body), ...cloudImg(req.file) });
    return res.status(201).json(pkg);
  }
  // bulk array (no file upload)
  if (!Array.isArray(req.body) || !req.body.length)
    return res.status(400).json({ error: 'Body must be a non-empty array or single object' });
  const result = await Package.insertMany(req.body);
  res.status(201).json(result);
});

// PUT /packages/:id  (admin)
export const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) return res.status(404).json({ message: 'Package not found' });
  const body = normalizePackageBody(req.body);
  if (req.file) { await maybeDelOld(pkg); Object.assign(body, cloudImg(req.file)); }
  Object.assign(pkg, body);
  await pkg.save();
  res.json(pkg);
});

// DELETE /packages/:id  (admin)
export const deletePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findByIdAndDelete(req.params.id);
  if (!pkg) return res.status(404).json({ message: 'Package not found' });
  await maybeDelOld(pkg);
  // Also delete gallery images from Cloudinary
  for (const g of pkg.gallery || []) {
    if (g.publicId) await deleteFromCloudinary(g.publicId);
  }
  res.json({ success: true, message: 'Package deleted' });
});

// POST /packages/:id/gallery  (admin – upload multiple gallery images)
export const uploadGallery = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) return res.status(404).json({ message: 'Package not found' });
  if (!req.files?.length) return res.status(400).json({ message: 'No images uploaded' });

  const captions = req.body.captions ? JSON.parse(req.body.captions) : [];

  const newImages = req.files.map((f, i) => ({
    img     : f.path,
    caption : captions[i] || `Image ${i + 1}`,
    publicId: f.filename,
  }));

  pkg.gallery = [...(pkg.gallery || []), ...newImages];
  await pkg.save();
  res.json({ success: true, message: 'Gallery updated', gallery: pkg.gallery });
});

// DELETE /packages/:id/gallery  (admin – remove a single gallery image)
// Body: { publicId }
export const removeGalleryImage = asyncHandler(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) return res.status(400).json({ message: 'publicId is required.' });

  const pkg = await Package.findById(req.params.id);
  if (!pkg) return res.status(404).json({ message: 'Package not found' });

  const image = pkg.gallery.find((g) => g.publicId === publicId);
  if (!image) return res.status(404).json({ message: 'Gallery image not found.' });

  await deleteFromCloudinary(publicId);
  pkg.gallery = pkg.gallery.filter((g) => g.publicId !== publicId);
  await pkg.save();

  res.json({ success: true, message: 'Gallery image removed', gallery: pkg.gallery });
});
