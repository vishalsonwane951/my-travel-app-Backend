import { uploaders } from '../utils/cloudinary.js';
import { protect, admin } from '../Middlewares/authMiddleware.js'
import {
  getCards, insertCards, addCard, updateCard, getAllFavourites, getMyWishlist, toggleFavourite, deleteCard,
  togglePackageFavourite, getMyFavouritePackages, getMyFavouritePackageIds,
} from '../Controllers/FavouritesController.js';
import express from 'express'

const router = express.Router();
// Tour Cards (homepage carousel)
router.get('/getCards', getCards);
router.post('/insertCards', insertCards);                         // bulk insert (no file)
router.post('/addCard', protect, admin, uploaders.tourCards.single('img'), addCard);
router.put('/updateCard/:id', protect, admin, uploaders.tourCards.single('img'), updateCard);
router.delete('/deleteCard/:id', protect, admin, deleteCard);

// Wishlist — Package (main content type, used by the "like" heart button site-wide)
router.get('/my-wishlist/packages', protect, getMyFavouritePackages);
router.get('/my-wishlist/package-ids', protect, getMyFavouritePackageIds);
router.put('/package/:id/toggle', protect, togglePackageFavourite);

// Wishlist — TourCard (legacy, kept for backward compatibility)
router.get('/my-wishlist', protect,getAllFavourites);   // returns populated cards
router.get('/my-wishlist-ids', protect,getMyWishlist);     // returns raw IDs
router.put('/:id/toggle', protect,toggleFavourite);

export default router;
