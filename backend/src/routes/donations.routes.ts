import { Router } from 'express';
import { createDonation, getDonations } from '../controllers/donations.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/',  createDonation);
router.get('/',   authenticate, authorize('super_admin', 'finance_manager'), getDonations);

export default router;
