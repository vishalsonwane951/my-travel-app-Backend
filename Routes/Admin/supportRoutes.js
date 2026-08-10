import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import {
  listTickets, getTicket, replyToTicket, updateTicketStatus,
} from '../../Controllers/Admin/supportController.js';

const router = express.Router();
router.use(protect, authorize('superadmin', 'support', 'operations'));

router.get('/', listTickets);
router.get('/:id', getTicket);
router.post('/:id/reply', replyToTicket);
router.put('/:id/status', updateTicketStatus);

export default router;
