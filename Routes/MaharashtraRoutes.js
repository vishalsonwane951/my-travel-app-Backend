import express from 'express';
import {
  getAllCards,
  createBulkCards,
  updateCard,
  deleteCard,
  getAllTravellerChoices,
  createBulkTravellerChoices,
  deleteTravellerChoice,
  getAllFamillyCard,
  createFamillyCard,
  getAllHiddenGames,
  createHiddenGames,
  getAllOutdoors,
  createOutdoors,
  getAllArtsTheatre,
  createArtTheatre,
  getAllNightLife,
  createNightLife,
  getAllMuseums,
  createMuseums
} from '../Controllers/MaharashtraController.js';

const router = express.Router();

// ---------- Maharashtra Essential Travel Cards ----------
router.get('/essential', getAllCards);
router.post('/essential/bulk', createBulkCards);
router.put('/essential/:id', updateCard);
router.delete('/essential/:id', deleteCard);

// ---------- Traveller Choice ----------
router.get('/gettraveller', getAllTravellerChoices);
router.post('/createtraveller', createBulkTravellerChoices);
router.delete('/traveller/:id', deleteTravellerChoice);

// ---------- Family-Friendly ----------
router.get('/getfamily', getAllFamillyCard);
router.post('/family', createFamillyCard);

// ---------- Hidden Games ----------
router.get('/gethidden-games', getAllHiddenGames);
router.post('/hidden-games', createHiddenGames);

//---------- Museums ----------

router.get('/getallmuseums', getAllMuseums);
router.post('/museums', createMuseums);

// ---------- Outdoors ----------
router.get('/getalloutdoors', getAllOutdoors);
router.post('/outdoors', createOutdoors);

// ---------- Arts & Theatre ----------
router.get('/getallarts-theatre', getAllArtsTheatre);
router.post('/arts-theatre', createArtTheatre);

// ---------- Nightlife ----------
router.get('/getallnightlife', getAllNightLife);
router.post('/createnightlife', createNightLife);

export default router;
