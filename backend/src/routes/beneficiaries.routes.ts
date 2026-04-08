import { Router } from 'express';
import { getBeneficiaries, createBeneficiary, updateBeneficiary } from '../controllers/beneficiaries.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// يمكن لمشرف النظام، مدير المشاريع، ومسؤول الحالات التعامل مع المستفيدين
const allowedRoles = ['super_admin', 'project_manager', 'case_worker'];

// قائمة المستفيدين
router.get('/', authenticate, authorize(...allowedRoles), getBeneficiaries);

// تسجيل مستفيد جديد
router.post('/', authenticate, authorize(...allowedRoles), createBeneficiary);

// تحديث بيانات مستفيد
router.put('/:id', authenticate, authorize(...allowedRoles), updateBeneficiary);

export default router;
