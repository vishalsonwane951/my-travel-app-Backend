import express from 'express';
import { addFavourites, getAllFavourites, removeFavourites } from '../Controllers/MyFavouritesController';
import { protect } from '../Middlewares/authMiddleware';

const router = express.Router()

router.post("/add-favourite", protect, addFavourites)
router.get("/get-All-Favourites", protect, getAllFavourites)
router.delete("/remove-favourite", protect, removeFavourites)