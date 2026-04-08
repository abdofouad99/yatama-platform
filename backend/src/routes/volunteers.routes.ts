import { Router } from 'express';
import { getVolunteers, createVolunteer, updateVolunteer } from '../controllers/volunteers.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// الإدارة تصرح بإدارة المتطوعين
router.use(authenticate, authorize('super_admin', 'project_manager'));

router.get('/', getVolunteers);
router.post('/', createVolunteer);
router.put('/:id', updateVolunteer);

export default router;
