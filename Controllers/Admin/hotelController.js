import asyncHandler from 'express-async-handler';
import Hotel from '../../Models/Hotel.js';
import { deleteFromCloudinary } from '../../utils/cloudinary.js';

export const listHotels = asyncHandler(async (req, res) => {
  const { destination, active, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (destination) filter.destination = new RegExp(destination, 'i');
  if (active !== undefined) filter.active = active === 'true';
  const [hotels, total] = await Promise.all([
    Hotel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
    Hotel.countDocuments(filter),
  ]);
  res.json({ success: true, hotels, total, page: Number(page), pages: Math.ceil(total / limit) });
});

export const getHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found.' });
  res.json({ success: true, hotel });
});

export const createHotel = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (body.roomTypes && typeof body.roomTypes === 'string') body.roomTypes = JSON.parse(body.roomTypes);
  if (body.amenities && typeof body.amenities === 'string') body.amenities = body.amenities.split(';').map((s) => s.trim()).filter(Boolean);

  if (req.files?.length) {
    body.images = req.files.map((f) => f.path);
    body.imagePublicIds = req.files.map((f) => f.filename);
  }

  const hotel = await Hotel.create(body);
  await req.audit?.({ action: 'create', module: 'hotels', targetId: hotel._id, after: hotel.toObject() });
  res.status(201).json({ success: true, message: 'Hotel added.', hotel });
});

export const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found.' });

  const body = { ...req.body };
  if (body.roomTypes && typeof body.roomTypes === 'string') body.roomTypes = JSON.parse(body.roomTypes);
  if (body.amenities && typeof body.amenities === 'string') body.amenities = body.amenities.split(';').map((s) => s.trim()).filter(Boolean);

  if (req.files?.length) {
    body.images = [...hotel.images, ...req.files.map((f) => f.path)];
    body.imagePublicIds = [...hotel.imagePublicIds, ...req.files.map((f) => f.filename)];
  }

  Object.assign(hotel, body);
  await hotel.save();
  await req.audit?.({ action: 'update', module: 'hotels', targetId: hotel._id });
  res.json({ success: true, hotel });
});

export const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found.' });
  for (const publicId of hotel.imagePublicIds || []) {
    try { await deleteFromCloudinary(publicId); } catch (_) { /* best-effort cleanup */ }
  }
  await hotel.deleteOne();
  await req.audit?.({ action: 'delete', module: 'hotels', targetId: req.params.id });
  res.json({ success: true, message: 'Hotel removed.' });
});

export const toggleHotelActive = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found.' });
  hotel.active = !hotel.active;
  await hotel.save();
  res.json({ success: true, hotel });
});
