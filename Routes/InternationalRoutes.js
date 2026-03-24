import express from 'express';
import { getAll1, add1, update1, delete1 } from '../Controllers/InternationalController.js';
import { protect, admin } from '../Middlewares/authMiddleware.js';
import { uploaders } from '../utils/cloudinary.js';

const router = express.Router();

const mw = uploaders.international;

router.get('/getallInternational',                                   getAll1);
router.post('/addInternational',         protect, admin, mw.single('images'), add1);
router.put('/updateInternational/:id',   protect, admin, mw.single('images'), update1);
router.delete('/deleteInternational/:id', protect, admin,            delete1);

export default router;