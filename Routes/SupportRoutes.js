import express from 'express';
import { optionalAuth, protect } from '../Middlewares/authMiddleware.js';
import { createTicket, getMyTickets } from '../Controllers/Admin/supportController.js';

const router = express.Router();

router.post('/', optionalAuth, createTicket);
router.get('/mine', protect, getMyTickets);

export default router;
