import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import { listAuditLogs, listAuditModules } from '../../Controllers/Admin/auditLogController.js';

const router = express.Router();
router.use(protect, authorize('superadmin'));

router.get('/', listAuditLogs);
router.get('/modules', listAuditModules);

export default router;
