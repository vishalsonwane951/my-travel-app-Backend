import express from 'express'
import { protect, admin } from '../Middlewares/authMiddleware.js';
import { deleteGenericImage } from '../Controllers/MaharashtraController.js';

const router = express.Router();
// DELETE /delete-image/:id  — used by frontend DestCard admin button
// Searches Animation → States1 → States2 and removes matching doc
router.delete('/delete-image/:id', protect, admin, deleteGenericImage);

export default router;
