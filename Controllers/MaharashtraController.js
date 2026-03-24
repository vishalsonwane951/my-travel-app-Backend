import asyncHandler from 'express-async-handler';
import createDestinationModel from '../Models/Destinationmodel.js';
import  MaharashtraCard  from '../Models/MaharashtraCategoryModel.js';
// import  {MaharashtraCard}  from '../Models/MaharashtraModels.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';

// ── Domestic destination collections ─────────────────────────
const Animation = createDestinationModel('Animation');
const States1 = createDestinationModel('States1');
const States2 = createDestinationModel('States2');


// Helper: extract Cloudinary image info from req.file
const cloudImg = (file) => file
  ? { images: file.path, imagePublicId: file.filename }
  : {};

// Helper: delete old cloudinary image on update
const maybeDeleteOld = async (doc) => {
  if (doc.imagePublicId) await deleteFromCloudinary(doc.imagePublicId);
};

// ═════════════════ ANIMATION ═════════════════════════════════
export const getAllAnimation = asyncHandler(async (_req, res) => {
  res.json(await Animation.find({ active: true }).sort({ createdAt: -1 }));
});
export const addAnimation = asyncHandler(async (req, res) => {
  const doc = await Animation.create({ ...req.body, ...cloudImg(req.file) });
  res.status(201).json({ success: true, data: doc });
});
export const updateAnimation = asyncHandler(async (req, res) => {
  const doc = await Animation.findById(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  if (req.file) { await maybeDeleteOld(doc); Object.assign(req.body, cloudImg(req.file)); }
  Object.assign(doc, req.body); await doc.save();
  res.json({ success: true, data: doc });
});
export const deleteAnimation = asyncHandler(async (req, res) => {
  const doc = await Animation.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  await maybeDeleteOld(doc);
  res.json({ success: true, message: 'Deleted' });
});

// ═════════════════ STATES ROW-1 ══════════════════════════════
export const getStates = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await States1.find({ active: true }).sort({ createdAt: -1 }) });
});
export const addState = asyncHandler(async (req, res) => {
  const doc = await States1.create({ ...req.body, ...cloudImg(req.file) });
  res.status(201).json({ success: true, data: doc });
});
export const updateState = asyncHandler(async (req, res) => {
  const doc = await States1.findById(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  if (req.file) { await maybeDeleteOld(doc); Object.assign(req.body, cloudImg(req.file)); }
  Object.assign(doc, req.body); await doc.save();
  res.json({ success: true, data: doc });
});
export const deleteState = asyncHandler(async (req, res) => {
  const doc = await States1.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  await maybeDeleteOld(doc);
  res.json({ success: true, message: 'Deleted' });
});

// ═════════════════ STATES ROW-2 ══════════════════════════════
export const getStates2 = asyncHandler(async (_req, res) => {
  res.json(await States2.find({ active: true }).sort({ createdAt: -1 }));
});
export const addState2 = asyncHandler(async (req, res) => {
  const doc = await States2.create({ ...req.body, ...cloudImg(req.file) });
  res.status(201).json({ success: true, data: doc });
});
export const updateState2 = asyncHandler(async (req, res) => {
  const doc = await States2.findById(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  if (req.file) { await maybeDeleteOld(doc); Object.assign(req.body, cloudImg(req.file)); }
  Object.assign(doc, req.body); await doc.save();
  res.json({ success: true, data: doc });
});
export const deleteState2 = asyncHandler(async (req, res) => {
  const doc = await States2.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  await maybeDeleteOld(doc);
  res.json({ success: true, message: 'Deleted' });
});

// ═════════════════ GENERIC DELETE (frontend DestCard) ════════
export const deleteGenericImage = asyncHandler(async (req, res) => {
  for (const Model of [Animation, States1, States2]) {
    const doc = await Model.findByIdAndDelete(req.params.id).catch(() => null);
    if (doc) { await maybeDeleteOld(doc); return res.json({ success: true, message: 'Deleted' }); }
  }
  res.status(404).json({ success: false, message: 'Not found in any domestic collection' });
});

// ═════════════════ IMAGE UPLOAD BY ID ════════════════════════
export const uploadImageById = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });
  const { id } = req.params;
  for (const Model of [States1, States2]) {
    const doc = await Model.findById(id);
    if (doc) {
      await maybeDeleteOld(doc);
      Object.assign(doc, cloudImg(req.file));
      await doc.save();
      return res.json({ success: true, message: 'Image updated', data: doc });
    }
  }
  res.status(404).json({ success: false, message: 'Document not found' });
});

// ═════════════════ TITLES ════════════════════════════════════
export const getAllTitles = asyncHandler(async (_req, res) => {
  const [titles1, titles2] = await Promise.all([
    States1.find({}, 'title'),
    States2.find({}, 'title'),
  ]);
  res.json({ success: true, titles1, titles2 });
});

//get card by category
export const getCards = asyncHandler(async (req, res) => {
  const { type } = req.params;

  const filter = {
    active: true,
  };

  // ✅ filter by category if type exists
  if (type) {
    filter.category = type.toLowerCase();
  }

  const data = await MaharashtraCard.find(filter).sort({ createdAt: -1 });

  if (!data.length) {
    return res.status(404).json({
      success: false,
      message: "No data found",
    });
  }

  res.status(200).json({
    success: true,
    category: type || "all",
    count: data.length,
    data,
  });
});

export const getAllCards = asyncHandler(async (req, res) => {
  const data = await MaharashtraCard.find().sort({ createdAt: -1 });

  if (!data.length) {
    return res.status(404).json({
      success: false,
      message: "No data found",
    });
  }

  res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
});