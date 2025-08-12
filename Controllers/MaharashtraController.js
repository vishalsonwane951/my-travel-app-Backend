import { MaharashtraCard, MaharashtraTravellerChoice, Outdoors, HiddenGames, ArtsTheatre, MaharashtraNightLife, MaharashtraFamillyfreindlly,MaharashtraMuseums } from '../Models/MaharashtraModels.js';

// ---------- Maharashtra Essential Cards ----------

export const getAllCards = async (req, res) => {
  try {
    const cards = await MaharashtraCard.find();
    if (!cards.length) return res.status(404).json({ message: 'No essential cards found' });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch essential cards', details: err.message });
  }
};

export const createBulkCards = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await MaharashtraCard.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert essential cards', details: err.message });
  }
};

export const updateCard = async (req, res) => {
  try {
    const updated = await MaharashtraCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Essential card not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update essential card', details: err.message });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const deleted = await MaharashtraCard.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Essential card not found' });
    res.json({ message: 'Essential card deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete essential card', details: err.message });
  }
};

// ---------- Maharashtra Traveller Choice Cards ----------

export const getAllTravellerChoices = async (req, res) => {
  try {
    const choices = await MaharashtraTravellerChoice.find();
    if (!choices.length) return res.status(404).json({ message: 'No traveller choices found' });
    res.json(choices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch traveller choices', details: err.message });
  }
};

export const createBulkTravellerChoices = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await MaharashtraTravellerChoice.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert traveller choices', details: err.message });
  }
};

export const deleteTravellerChoice = async (req, res) => {
  try {
    const deleted = await MaharashtraTravellerChoice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Traveller choice not found' });
    res.json({ message: 'Traveller choice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete traveller choice', details: err.message });
  }
};

// ---------- Family-Friendly ----------

export const getAllFamillyCard = async (req, res) => {
  try {
    const familly = await MaharashtraFamillyfreindlly.find();
    if (!familly.length) return res.status(404).json({ message: 'No Family data found' });
    res.json(familly);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch family cards', details: err.message });
  }
};

export const createFamillyCard = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await MaharashtraFamillyfreindlly.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert data', details: err.message });
  }
};

// ---------- Hidden-Games ----------

export const getAllHiddenGames = async (req, res) => {
  try {
    const games = await HiddenGames.find();
    if (!games.length) return res.status(404).json({ message: 'No hidden games found' });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hidden games cards', details: err.message });
  }
};

export const createHiddenGames = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await HiddenGames.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert data', details: err.message });
  }
};

// ---------- Outdoors ----------

export const getAllOutdoors = async (req, res) => {
  try {
    const cards = await Outdoors.find();
    if (!cards.length) return res.status(404).json({ message: 'No outdoors data found' });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch outdoors cards', details: err.message });
  }
};

export const createOutdoors = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await Outdoors.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert data', details: err.message });
  }
};

// ---------- Arts & Theatre ----------

export const getAllArtsTheatre = async (req, res) => {
  try {
    const cards = await ArtsTheatre.find();
    if (!cards.length) return res.status(404).json({ message: 'No arts & theatre data found' });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch arts & theatre cards', details: err.message });
  }
};

export const createArtTheatre = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await ArtsTheatre.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert data', details: err.message });
  }
};

// ---------- Night Life ----------

export const getAllNightLife = async (req, res) => {
  try {
    const cards = await MaharashtraNightLife.find();
    if (!cards.length) return res.status(404).json({ message: 'No night life data found' });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch night life cards', details: err.message });
  }
};

export const createNightLife = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await MaharashtraNightLife.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert data', details: err.message });
  }
};


//-------------------Museums ---------------------

export const getAllMuseums = async (req, res) => {
  try {
    const cards = await MaharashtraMuseums.find();
    if (!cards.length) return res.status(404).json({ message: 'No museums data found' });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch night life cards', details: err.message });
  }
};

export const createMuseums = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await MaharashtraMuseums.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert data', details: err.message });
  }
};