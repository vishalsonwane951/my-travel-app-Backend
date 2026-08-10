import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import { listAllAddOns, createAddOn, updateAddOn, deleteAddOn } from '../../Controllers/Admin/addOnController.js';
import { listAllGiftCards } from '../../Controllers/giftCardController.js';

const router = express.Router();
router.use(protect, authorize('superadmin', 'operations', 'sales'));

router.get('/addons', listAllAddOns);
router.post('/addons', createAddOn);
router.put('/addons/:id', updateAddOn);
router.delete('/addons/:id', deleteAddOn);

router.get('/gift-cards', listAllGiftCards);

export default router;
