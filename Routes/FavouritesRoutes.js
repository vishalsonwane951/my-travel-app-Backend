import express from "express";
import { getCards, toggleFavourite, getAllFavourites,insertCards } from '../Controllers/FavouritesController.js';
import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getCards", getCards);                // fetch all cards
router.put("/:id/toggle",protect, toggleFavourite);
router.post("/insert", insertCards);
router.get("/:id", protect, getAllFavourites);

export default router;
