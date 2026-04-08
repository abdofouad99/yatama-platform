import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// ==========================================
// GET /api/v1/projects — قائمة المشاريع (عامة)
// ==========================================
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      status    = 'active',
      category,
      featured,
      page      = '1',
      limit     = '12',
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status)   where.status    = status;
    if (category) where.category  = category;
    if (featured) where.isFeatured = featured === 'true';

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        select: {
          id: true, title: true, description: true,
          category: true, goalAmount: true, currentAmount: true,
          status: true, startDate: true, endDate: true,
          coverImageUrl: true, isFeatured: true,
          _count: { select: { donations: true } },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: Number(limit),
      }),
      prisma.project.count({ where }),
    ]);

    // حساب نسبة التقدم
    const projectsWithProgress = projects.map(p => ({
      ...p,
      progressPercent: p.goalAmount > 0
        ? Math.min(Math.round((Number(p.currentAmount) / Number(p.goalAmount)) * 100), 100)
        : 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        projects: projectsWithProgress,
        pagination: {
          total,
          page:     Number(page),
          limit:    Number(limit),
          pages:    Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('getProjects error:', error);
    res.status(500).json({ success: false, message: 'خطأ في جلب المشاريع' });
  }
};

// ==========================================
// GET /api/v1/projects/:id — تفاصيل مشروع
// ==========================================
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
      include: {
        budget:  true,
        manager: { select: { id: true, fullName: true } },
        _count:  { select: { donations: true, tasks: true } },
      },
    });

    if (!project) {
      res.status(404).json({ success: false, message: 'المشروع غير موجود' });
      return;
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في جلب تفاصيل المشروع' });
  }
};

// ==========================================
// POST /api/v1/projects — إنشاء مشروع جديد
// ==========================================
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title, description, category,
      goalAmount, startDate, endDate, isFeatured,
    } = req.body;

    if (!title || !category || !goalAmount) {
      res.status(400).json({
        success: false,
        message: 'العنوان، التصنيف، والمبلغ المستهدف مطلوبة',
      });
      return;
    }

    const project = await prisma.project.create({
      data: {
        title, description, category,
        goalAmount:   Number(goalAmount),
        startDate:    startDate ? new Date(startDate) : undefined,
        endDate:      endDate   ? new Date(endDate)   : undefined,
        isFeatured:   isFeatured || false,
        managedBy:    req.user!.id,
      },
    });

    // إنشاء ميزانية تلقائية للمشروع
    await prisma.budget.create({
      data: {
        projectId:  project.id,
        totalAmount: Number(goalAmount),
      },
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء المشروع بنجاح',
      data: project,
    });
  } catch (error) {
    console.error('createProject error:', error);
    res.status(500).json({ success: false, message: 'خطأ في إنشاء المشروع' });
  }
};
// ==========================================
// PUT /api/v1/projects/:id — تعديل مشروع
// ==========================================
export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, category, goalAmount, status, isFeatured } = req.body;

    // التحقق من وجود المشروع
    const existing = await prisma.project.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'المشروع غير موجود' });
      return;
    }

    const updated = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        ...(title       !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category    !== undefined && { category }),
        ...(goalAmount  !== undefined && { goalAmount: Number(goalAmount) }),
        ...(status      !== undefined && { status }),
        ...(isFeatured  !== undefined && { isFeatured }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'تم تحديث المشروع بنجاح',
      data: updated,
    });
  } catch (error) {
    console.error('updateProject error:', error);
    res.status(500).json({ success: false, message: 'خطأ في تحديث المشروع' });
  }
};

// ==========================================
// DELETE /api/v1/projects/:id — حذف مشروع
// ==========================================
export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.project.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'المشروع غير موجود' });
      return;
    }

    // التحقق من عدم وجود تبرعات مكتملة
    const donationsCount = await prisma.donation.count({
      where: { projectId: Number(id), status: 'completed' },
    });
    if (donationsCount > 0) {
      res.status(400).json({
        success: false,
        message: `لا يمكن حذف المشروع — يوجد ${donationsCount} تبرع مرتبط به`,
      });
      return;
    }

    await prisma.project.delete({ where: { id: Number(id) } });

    res.status(200).json({ success: true, message: 'تم حذف المشروع بنجاح' });
  } catch (error) {
    console.error('deleteProject error:', error);
    res.status(500).json({ success: false, message: 'خطأ في حذف المشروع' });
  }
};
