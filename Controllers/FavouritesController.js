import asyncHandler from 'express-async-handler';
import TourCard from '../Models/TourCardModel.js';
import Favourite from '../Models/FavoirateModel.js';
import User from '../Models/UserModel.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';
const cloudImg = (file) => file ? { img: file.path, imgPublicId: file.filename } : {};

// ── PACKAGE WISHLIST (the site's main content type) ─────────────
// PUT /favourites/package/:id/toggle
export const togglePackageFavourite = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params; // Package ID

  const existing = await Favourite.findOne({ user: userId, package: id });

  if (existing) {
    await Favourite.deleteOne({ _id: existing._id });
    return res.json({ success: true, message: 'Removed from wishlist', package: id, liked: false });
  }

  await Favourite.create({ user: userId, package: id, status: 'like' });
  res.json({ success: true, message: 'Added to wishlist', package: id, liked: true });
});

// GET /favourites/my-wishlist/packages — populated Package docs the user has liked
export const getMyFavouritePackages = asyncHandler(async (req, res) => {
  const favs = await Favourite.find({ user: req.user._id, package: { $ne: null } })
    .sort({ createdAt: -1 })
    .populate('package');
  const packages = favs.map((f) => f.package).filter(Boolean);
  res.json({ success: true, count: packages.length, packages });
});

// GET /favourites/my-wishlist/package-ids — just IDs (cheap, for heart-button state on listing pages)
export const getMyFavouritePackageIds = asyncHandler(async (req, res) => {
  const favs = await Favourite.find({ user: req.user._id, package: { $ne: null } }).select('package');
  res.json({ success: true, ids: favs.map((f) => String(f.package)) });
});

// ── TOUR CARDS ─────────────────────────────────────────────────
export const getCards = asyncHandler(async (_req, res) => {
  try {
    // Fetch only active tour cards
    const tourCards = await TourCard.find({ active: true })
      .sort({ sortOrder: 1, createdAt: -1 }); // sortOrder first, then newest

    console.log("TourCards fetched:", tourCards.length); // debug

    res.status(200).json(tourCards); // returns array
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export const insertCards = asyncHandler(async (req, res) => {
  const cards = req.body;
  if (!Array.isArray(cards)) return res.status(400).json({ message: 'Data must be an array' });
  const result = await TourCard.insertMany(cards);
  res.status(201).json({ message: 'Cards inserted successfully', data: result });
});

export const addCard = asyncHandler(async (req, res) => {
  const card = await TourCard.create({ ...req.body, ...cloudImg(req.file) });
  res.status(201).json({ success: true, data: card });
});

export const updateCard = asyncHandler(async (req, res) => {
  const card = await TourCard.findById(req.params.id);
  if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
  if (req.file) {
    if (card.imgPublicId) await deleteFromCloudinary(card.imgPublicId);
    Object.assign(req.body, cloudImg(req.file));
  }
  Object.assign(card, req.body); await card.save();
  res.json({ success: true, data: card });
});

export const deleteCard = asyncHandler(async (req, res) => {
  const card = await TourCard.findByIdAndDelete(req.params.id);
  if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
  if (card.imgPublicId) await deleteFromCloudinary(card.imgPublicId);
  res.json({ success: true, message: 'Deleted' });
});

// ── WISHLIST TOGGLE ────────────────────────────────────────────
// Matches frontend: api.put(`/favourites/${id}/toggle`)
export const toggleFavourite = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;  // TourCard ID

  let fav = await Favourite.findOne({ user: userId, tourCard: id });

  if (fav) {
    await Favourite.deleteOne({ _id: fav._id });
    return res.json({ message: 'Removed from favourites', tourCard: id, status: 'unlike' });
  }

  fav = await Favourite.create({ user: userId, tourCard: id, status: 'like' });
  res.json({ message: 'Added to favourites', tourCard: id, status: 'like' });
});

// GET /favourites/my-wishlist  — all liked cards for logged-in user
export const getAllFavourites = asyncHandler(async (req, res) => {
  const favs  = await Favourite.find({ user: req.user._id, status: 'like' }).populate('tourCard');
  const cards = favs.map(f => f.tourCard).filter(Boolean);
  res.json(cards);
});

// GET /favourites/my-wishlist-ids  — just IDs (fast)
export const getMyWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, wishlist: user.wishlist });
});
