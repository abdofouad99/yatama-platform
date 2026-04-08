import { Router } from 'express';
import { getUsers, createUser, updateUser, toggleUser } from '../controllers/users.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// قائمة المستخدمين - للمشرفين فقط
router.get('/', authenticate, authorize('super_admin'), getUsers);

// إنشاء مستخدم جديد
router.post('/', authenticate, authorize('super_admin'), createUser);

// تعديل بيانات مستخدم
router.put('/:id', authenticate, authorize('super_admin'), updateUser);

// تفعيل/تعطيل مستخدم
router.patch('/:id/toggle', authenticate, authorize('super_admin'), toggleUser);

export default router;
