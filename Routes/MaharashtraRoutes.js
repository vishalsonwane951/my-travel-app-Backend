import express from 'express';
import * as ctrl from "../Controllers/MaharashtraController.js";
import { protect, admin } from '../Middlewares/authMiddleware.js';
import {uploaders} from '../utils/cloudinary.js';
;
const router = express.Router();
const mw = uploaders.maharashtra;

// ── Animation slideshow ───────────────────────────────────────
router.get('/getallAnimation', ctrl.getAllAnimation);
router.post('/addAnimation', protect, admin, mw.single('images'), ctrl.addAnimation);
router.put('/updateAnimation/:id', protect, admin, mw.single('images'), ctrl.updateAnimation);
router.delete('/deleteAnimation/:id', protect, admin, ctrl.deleteAnimation);

// ── States row-1 ──────────────────────────────────────────────
router.get('/getstates', ctrl.getStates);
router.get('/titles', ctrl.getAllTitles);
router.post('/addstate', protect, admin, mw.single('images'), ctrl.addState);
router.put('/updatestate/:id', protect, admin, mw.single('images'), ctrl.updateState);
router.delete('/deletestate/:id', protect, admin, ctrl.deleteState);

// ── States row-2 ──────────────────────────────────────────────
router.get('/getstates2', ctrl.getStates2);
router.post('/addstate2', protect, admin, mw.single('image'), ctrl.addState2);
router.put('/updatestate2/:id', protect, admin, mw.single('image'), ctrl.updateState2);
router.delete('/deletestate2/:id', protect, admin, ctrl.deleteState2);

// ── Image upload by ID ────────────────────────────────────────
router.put('/upload-image/:id', protect, admin, mw.single('image'), ctrl.uploadImageById);

// ── Category collections (GET public, POST/DELETE admin) ──────
const cats = [
  { path: 'essential', ctrl: ctrl.essential },
  { path: 'traveller', ctrl: ctrl.traveller },
  { path: 'family', ctrl: ctrl.family },
  { path: 'hidden', ctrl: ctrl.hidden },
  { path: 'outdoors', ctrl: ctrl.outdoors },
  { path: 'arts', ctrl: ctrl.arts },
  { path: 'nightlife', ctrl: ctrl.nightlife },
  { path: 'museums', ctrl: ctrl.museums },
];

for (const { path, ctrl: c } of cats) {
  router.get(`/${path}`, c.getAll);
  router.post(`/${path}`, protect, admin, c.createBulk);
  router.put(`/${path}/:id`, protect, admin, mw.single('images'), c.updateOne);
  router.delete(`/${path}/:id`, protect, admin, c.deleteOne);
}

export default router;
