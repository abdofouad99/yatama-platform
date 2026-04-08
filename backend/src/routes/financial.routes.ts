import { Router } from 'express';
import { getTransactions, createTransaction } from '../controllers/financial.controller';
import { getBudgets, setBudget } from '../controllers/budgets.controller';
import { getFinancialReportSummary } from '../controllers/reports.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, authorize('super_admin', 'finance_manager'));

router.get('/transactions', getTransactions);
router.post('/transactions', createTransaction);

router.get('/budgets', getBudgets);
router.post('/budgets', setBudget);

router.get('/reports/summary', getFinancialReportSummary);

export default router;
