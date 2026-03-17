import express from 'express';
import  { getAll1, add1, update1, delete1,getAll2, add2, update2, delete2} from '../Controllers/InternationalController.js';
import { protect, admin } from '../Middlewares/authMiddleware.js';
import { uploaders } from '../utils/cloudinary.js';

const router = express.Router() ;

const mw = uploaders.international;

router.get('/getallInternational', getAll1);
router.post('/addInternational', protect, admin, mw.single('images'), add1);
router.put('/updateInternational/:id', protect, admin, mw.single('images'),update1);
router.delete('/deleteInternational/:id', protect, admin, delete1);

router.get('/getallInternational2', getAll2);
router.post('/addInternational2', protect, admin, uploaders.international2.single('images'), add2);
router.put('/updateInternational2/:id', protect, admin, uploaders.international2.single('images'),update2);
router.delete('/deleteInternational2/:id', protect, admin, delete2);

export default router;
