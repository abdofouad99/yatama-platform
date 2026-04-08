import { Router } from 'express';
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projects.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /api/v1/projects
 * قائمة المشاريع (عامة - لا يلزم تسجيل دخول)
 * Query: status, category, featured, page, limit
 */
router.get('/', getProjects);

/**
 * GET /api/v1/projects/:id
 * تفاصيل مشروع محدد (عام)
 */
router.get('/:id', getProjectById);

/**
 * POST /api/v1/projects
 * إنشاء مشروع جديد
 * Auth: super_admin | project_manager
 */
router.post(
  '/',
  authenticate,
  authorize('super_admin', 'project_manager'),
  createProject
);

router.put(
  '/:id',
  authenticate,
  authorize('super_admin', 'project_manager'),
  updateProject
);

router.delete(
  '/:id',
  authenticate,
  authorize('super_admin'),
  deleteProject
);

export default router;
