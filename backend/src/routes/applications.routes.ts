import { Router } from 'express';
import {
  submitApplication,
  getApplications,
  reviewApplication,
} from '../controllers/applications.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/v1/applications
 * تقديم طلب مساعدة من الموقع (عام - لا يلزم حساب)
 * Body: { applicantName, applicantPhone, applicantEmail, nationalId,
 *         governorate, address, applicationType, membersCount,
 *         monthlyIncome, description }
 */
router.post('/', submitApplication);

/**
 * GET /api/v1/applications
 * قائمة الطلبات للإدارة
 * Auth: super_admin | project_manager
 * Query: status, governorate, applicationType, page, limit
 */
router.get(
  '/',
  authenticate,
  authorize('super_admin', 'project_manager'),
  getApplications
);

/**
 * PATCH /api/v1/applications/:id/review
 * مراجعة طلب وتحديث حالته
 * Auth: super_admin | project_manager
 * Body: { status: 'approved'|'rejected'|'under_review', reviewNotes }
 */
router.patch(
  '/:id/review',
  authenticate,
  authorize('super_admin', 'project_manager'),
  reviewApplication
);

export default router;
