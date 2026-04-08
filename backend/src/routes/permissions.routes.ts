import { Router } from 'express';
import { getPermissions, createPermission, updatePermission, deletePermission } from '../controllers/permissions.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, authorize('super_admin'));

router.get('/', getPermissions);
router.post('/', createPermission);
router.put('/:id', updatePermission);
router.delete('/:id', deletePermission);

export default router;
