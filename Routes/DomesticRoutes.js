// routes/DomesticRoutes.js
import express from 'express';
import {
  getallAnimation, createAnimation,
  getAllStates,  createStates,  addState,  updateState,  deleteState,
  getAllStates2, createStates2, addState2, updateState2, deleteState2,
} from '../Controllers/DomesticController.js';
import { protect, admin } from '../Middlewares/authMiddleware.js';
import { uploaders } from '../utils/cloudinary.js';

const router = express.Router();

const mw1 = uploaders.domesticStates;   // → folder: 'domestic-states'
const mw2 = uploaders.domesticStates2;  // → folder: 'domestic-states-2'

// ── Animation ─────────────────────────────────────────────────
router.get('/getallanimation',             getallAnimation);
router.post('/createanimation', protect, admin, createAnimation);

// ── States ────────────────────────────────────────────────────
router.get('/getstates',                   getAllStates);
router.post('/createstates',  protect, admin, createStates);                        // bulk insert (no image)
router.post('/addstate',      protect, admin, mw1.single('images'), addState);      // single add with image
router.put('/updatestate/:id',  protect, admin, mw1.single('images'), updateState);
router.delete('/deletestate/:id', protect, admin, deleteState);

// ── States 2 ──────────────────────────────────────────────────
router.get('/getstates2',                  getAllStates2);
router.post('/createstates2', protect, admin, createStates2);                       // bulk insert (no image)
router.post('/addstate2',     protect, admin, mw2.single('images'), addState2);     // single add with image
router.put('/updatestate2/:id', protect, admin, mw2.single('images'), updateState2);
router.delete('/deletestate2/:id', protect, admin, deleteState2);

export default router;