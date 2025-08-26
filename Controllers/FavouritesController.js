import TourCard from "../Models/TourCardModel.js";
import Favourite from "../Models/MyFavouritesModel.js"

// ✅ Get all cards
export const getCards = async (req, res) => {
  try {
    const cards = await TourCard.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cards", error });
  }
};


export const insertCards = async (req, res) => {
  try {
    const cards = req.body; // expecting array of objects
    if (!Array.isArray(cards)) {
      return res.status(400).json({ message: "Data must be an array of cards" });
    }

    const insertedCards = await TourCard.insertMany(cards);
    res.status(201).json({
      message: "Cards inserted successfully",
      data: insertedCards,
    });
  } catch (error) {
    res.status(500).json({ message: "Error inserting cards", error });
  }
};


//Favourites


// Controllers/favouriteController.js
// Controllers/favouriteController.js

export const toggleFavourite = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ from protect middleware
    const { id } = req.params;   // TourCard ID

    // Check if favourite already exists
    let fav = await Favourite.findOne({ user: userId, tourCard: id });

    if (fav) {
      // If already liked, remove it (unlike = delete)
      await Favourite.deleteOne({ _id: fav._id });
      return res.json({
        message: "Removed from favourites",
        tourCard: id,
        status: "unlike",
      });
    } else {
      // If not exists, create new as like
      fav = await Favourite.create({ user: userId, tourCard: id, status: "like" });
      return res.json({
        message: "Added to favourites",
        tourCard: id,
        status: "like",
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Get Like Card in My Favourite section
export const getAllFavourites = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all favourites with status "like" for this user
    const favourites = await Favourite.find({ user: userId, status: "like" }).populate("tourCard");

    // Extract only the tourCard data
    const tourCards = favourites.map(fav => fav.tourCard);

    res.json(tourCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch favourites" });
  }
};



