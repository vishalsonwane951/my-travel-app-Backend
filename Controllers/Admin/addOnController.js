import asyncHandler from 'express-async-handler';
import AddOn from '../../Models/AddOn.js';

// Public
export const listActiveAddOns = asyncHandler(async (req, res) => {
  const addOns = await AddOn.find({ active: true }).sort({ category: 1, price: 1 });
  res.json({ success: true, addOns });
});

// Admin
export const listAllAddOns = asyncHandler(async (req, res) => {
  const addOns = await AddOn.find().sort({ createdAt: -1 });
  res.json({ success: true, addOns });
});

export const createAddOn = asyncHandler(async (req, res) => {
  const addOn = await AddOn.create(req.body);
  await req.audit?.({ action: 'create', module: 'addons', targetId: addOn._id });
  res.status(201).json({ success: true, addOn });
});

export const updateAddOn = asyncHandler(async (req, res) => {
  const addOn = await AddOn.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!addOn) return res.status(404).json({ success: false, message: 'Add-on not found.' });
  await req.audit?.({ action: 'update', module: 'addons', targetId: addOn._id });
  res.json({ success: true, addOn });
});

export const deleteAddOn = asyncHandler(async (req, res) => {
  await AddOn.findByIdAndDelete(req.params.id);
  await req.audit?.({ action: 'delete', module: 'addons', targetId: req.params.id });
  res.json({ success: true, message: 'Add-on deleted.' });
});
