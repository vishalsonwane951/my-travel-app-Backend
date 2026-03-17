import asyncHandler from 'express-async-handler';
import createDestinationModel from '../Models/Destinationmodel.js'
import {deleteFromCloudinary} from '../utils/cloudinary.js';
import { International } from '../Models/InternationalModel.js';

// const International= createDestinationModel('International');
const International2 = createDestinationModel('International2');

const cloudImg     = (file) => file ? { images: file.path, imagePublicId: file.filename } : {};
const maybeDelOld  = async (doc) => { if (doc.imagePublicId) await deleteFromCloudinary(doc.imagePublicId); };

// ── ROW 1 ─────────────────────────────────────────────────────
export const getAll1 = asyncHandler(async (_req, res) => {

  const data = await International
    .find()
    .sort({ createdAt: -1 });

  if (!data.length) {
    return res.status(200).json([]);
  }

  res.status(200).json(data);
});

export const add1 = asyncHandler(async (req, res) => {
  const doc = await International1.create({ ...req.body, ...cloudImg(req.file) });
  res.status(201).json({ success: true, data: doc });
});

export const update1 = asyncHandler(async (req, res) => {
  const doc = await International1.findById(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  if (req.file) { await maybeDelOld(doc); Object.assign(req.body, cloudImg(req.file)); }
  Object.assign(doc, req.body); await doc.save();
  res.json({ success: true, data: doc });
});

export const delete1 = asyncHandler(async (req, res) => {
  const doc = await International1.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  await maybeDelOld(doc);
  res.json({ success: true, message: 'Deleted' });
});

// ── ROW 2 ─────────────────────────────────────────────────────
export const getAll2 = asyncHandler(async (_req, res) => {
  const data = await International2.find({ active: true }).sort({ featured: -1, createdAt: -1 });
  if (!data.length) return res.status(404).json({ message: 'No data found' });
  res.status(200).json(data);
});

export const add2 = asyncHandler(async (req, res) => {
  const doc = await International2.create({ ...req.body, ...cloudImg(req.file) });
  res.status(201).json({ success: true, data: doc });
});

export const update2 = asyncHandler(async (req, res) => {
  const doc = await International2.findById(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  if (req.file) { await maybeDelOld(doc); Object.assign(req.body, cloudImg(req.file)); }
  Object.assign(doc, req.body); await doc.save();
  res.json({ success: true, data: doc });
});

export const delete2 = asyncHandler(async (req, res) => {
  const doc = await International2.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  await maybeDelOld(doc);
  res.json({ success: true, message: 'Deleted' });
});
