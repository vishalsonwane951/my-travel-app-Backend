import { uploaders } from '../utils/cloudinary.js';
import { protect, admin } from '../Middlewares/authMiddleware.js'
import { getCards,insertCards, addCard , updateCard, getAllFavourites, getMyWishlist, toggleFavourite, deleteCard} from '../Controllers/FavouritesController.js';
import express from 'express'

const router = express.Router();
// Tour Cards (homepage carousel)
router.get('/getCards', getCards);
router.post('/insertCards', insertCards);                         // bulk insert (no file)
router.post('/addCard', protect, admin, uploaders.tourCards.single('img'), addCard);
router.put('/updateCard/:id', protect, admin, uploaders.tourCards.single('img'), updateCard);
router.delete('/deleteCard/:id', protect, admin, deleteCard);

// Wishlist (authenticated)
router.get('/my-wishlist', protect,getAllFavourites);   // returns populated cards
router.get('/my-wishlist-ids', protect,getMyWishlist);     // returns raw IDs

// Toggle like/unlike — matches frontend: api.put(`/favourites/${id}/toggle`)
router.put('/:id/toggle', protect,toggleFavourite);

export default router;
