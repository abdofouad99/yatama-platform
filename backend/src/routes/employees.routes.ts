import { Router } from 'express';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../controllers/employees.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// يمكن لمدراء النظام الوصول لبيانات الموظفين
router.use(authenticate, authorize('super_admin'));

router.get('/', getEmployees);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
