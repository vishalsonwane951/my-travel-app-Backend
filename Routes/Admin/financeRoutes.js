import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import {
  createInvoice, listInvoices, getInvoice, regenerateInvoicePdf,
  listPayments, recordManualPayment,
  listExpenses, createExpense, deleteExpense,
  listCommissions, updateCommissionStatus,
  getProfitAndLoss, getCashFlow, getTaxReport, exportCsv,
} from '../../Controllers/Admin/financeController.js';

const router = express.Router();

router.use(protect, authorize('superadmin', 'finance'));

router.get('/invoices', listInvoices);
router.get('/invoices/:id', getInvoice);
router.post('/invoices', createInvoice);
router.put('/invoices/:id/regenerate-pdf', regenerateInvoicePdf);

router.get('/payments', listPayments);
router.post('/payments', recordManualPayment);

router.get('/expenses', listExpenses);
router.post('/expenses', createExpense);
router.delete('/expenses/:id', deleteExpense);

router.get('/commissions', listCommissions);
router.put('/commissions/:id/status', updateCommissionStatus);

router.get('/reports/pnl', getProfitAndLoss);
router.get('/reports/cashflow', getCashFlow);
router.get('/reports/tax', getTaxReport);
router.get('/export/csv', exportCsv);

export default router;
