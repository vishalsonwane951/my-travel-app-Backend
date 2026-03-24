// Controllers/DomesticController.js
import asyncHandler from 'express-async-handler';
import { MaharashtraAnimation, MaharashtraState, MaharashtraState2 } from '../Models/DomesticModel.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';

const cloudImg    = (file) => file ? { images: file.path, imagePublicId: file.filename } : {};
const maybeDelOld = async (doc) => { if (doc.imagePublicId) await deleteFromCloudinary(doc.imagePublicId); };

// ── ANIMATION ────────────────────────────────────────────────
export const getallAnimation = asyncHandler(async (req, res) => {
  const data = await MaharashtraAnimation.find();
  if (!data.length) return res.status(404).json({ message: 'No data found' });
  res.json(data);
});

export const createAnimation = asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body) || req.body.length === 0)
    return res.status(400).json({ error: 'Request body must be a non-empty array' });
  const result = await MaharashtraAnimation.insertMany(req.body);
  res.status(201).json({ message: 'Data inserted successfully', data: result });
});

// ── STATES ───────────────────────────────────────────────────
export const getAllStates = asyncHandler(async (req, res) => {
  const states = await MaharashtraState.find().sort({ createdAt: -1 });
  res.status(200).json(states); // always return array
});

export const createStates = asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body) || req.body.length === 0)
    return res.status(400).json({ error: 'Request body must be a non-empty array' });
  const result = await MaharashtraState.insertMany(req.body);
  res.status(201).json({ success: true, data: result });
});

// Upload image for a single state (Cloudinary)
export const addState = asyncHandler(async (req, res) => {
  const doc = await MaharashtraState.create({ ...req.body, ...cloudImg(req.file) });
  res.status(201).json({ success: true, data: doc });
});

export const updateState = asyncHandler(async (req, res) => {
  const doc = await MaharashtraState.findById(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  if (req.file) { await maybeDelOld(doc); Object.assign(req.body, cloudImg(req.file)); }
  Object.assign(doc, req.body);
  await doc.save();
  res.json({ success: true, data: doc });
});

export const deleteState = asyncHandler(async (req, res) => {
  const doc = await MaharashtraState.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  await maybeDelOld(doc);
  res.json({ success: true, message: 'Deleted' });
});

// ── STATES 2 ─────────────────────────────────────────────────
export const getAllStates2 = asyncHandler(async (req, res) => {
  const data = await MaharashtraState2.find().sort({ createdAt: -1 });
  res.json(data); // always return array
});

export const createStates2 = asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body))
    return res.status(400).json({ message: 'Expected an array of states' });
  const result = await MaharashtraState2.insertMany(req.body);
  res.status(201).json({ message: 'Inserted successfully', insertedCount: result.length });
});

export const addState2 = asyncHandler(async (req, res) => {
  const doc = await MaharashtraState2.create({ ...req.body, ...cloudImg(req.file) });
  res.status(201).json({ success: true, data: doc });
});

export const updateState2 = asyncHandler(async (req, res) => {
  const doc = await MaharashtraState2.findById(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  if (req.file) { await maybeDelOld(doc); Object.assign(req.body, cloudImg(req.file)); }
  Object.assign(doc, req.body);
  await doc.save();
  res.json({ success: true, data: doc });
});

export const deleteState2 = asyncHandler(async (req, res) => {
  const doc = await MaharashtraState2.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  await maybeDelOld(doc);
  res.json({ success: true, message: 'Deleted' });
});