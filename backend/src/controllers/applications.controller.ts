import { Request, Response } from 'express';
import prisma from '../config/database';

// ==========================================
// POST /api/v1/applications — تقديم طلب إلكتروني
// ==========================================
export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      applicantName, applicantPhone, applicantEmail,
      nationalId, governorate, address,
      applicationType, membersCount, monthlyIncome, description,
    } = req.body;

    // التحقق من البيانات الأساسية
    if (!applicantName || !applicantPhone || !applicationType) {
      res.status(400).json({
        success: false,
        message: 'الاسم ورقم الهاتف ونوع الطلب مطلوبة',
      });
      return;
    }

    // التحقق من عدم تكرار الطلب (نفس الهوية في آخر 30 يوم)
    if (nationalId) {
      const recentApp = await prisma.onlineApplication.findFirst({
        where: {
          nationalId,
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      });

      if (recentApp) {
        res.status(409).json({
          success: false,
          message: 'لديك طلب قيد المراجعة بالفعل، يرجى الانتظار 30 يومًا قبل تقديم طلب جديد',
        });
        return;
      }
    }

    const application = await prisma.onlineApplication.create({
      data: {
        applicantName, applicantPhone,
        applicantEmail: applicantEmail || null,
        nationalId:     nationalId     || null,
        governorate:    governorate    || null,
        address:        address        || null,
        applicationType,
        membersCount:   Number(membersCount) || 1,
        monthlyIncome:  Number(monthlyIncome) || 0,
        description,
        status: 'pending',
      },
    });

    res.status(201).json({
      success: true,
      message: 'تم استقبال طلبك بنجاح، سيتم التواصل معك قريباً إن شاء الله',
      data: {
        applicationId: application.id,
        trackingCode:  `YCF-APP-${application.id}`,
        status:        'pending',
      },
    });
  } catch (error) {
    console.error('submitApplication error:', error);
    res.status(500).json({ success: false, message: 'خطأ في تقديم الطلب' });
  }
};

// ==========================================
// GET /api/v1/applications — قائمة الطلبات (للإدارة)
// ==========================================
export const getApplications = async (req: any, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '20', status, governorate, applicationType } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status)          where.status          = status;
    if (governorate)     where.governorate     = governorate;
    if (applicationType) where.applicationType = applicationType;

    const [applications, total] = await Promise.all([
      prisma.onlineApplication.findMany({
        where,
        include: {
          reviewer: { select: { fullName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.onlineApplication.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          total,
          page:  Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في جلب الطلبات' });
  }
};

// ==========================================
// PATCH /api/v1/applications/:id/review — مراجعة طلب
// ==========================================
export const reviewApplication = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    if (!['approved', 'rejected', 'under_review'].includes(status)) {
      res.status(400).json({ success: false, message: 'حالة الطلب غير صالحة' });
      return;
    }

    const application = await prisma.onlineApplication.update({
      where: { id: Number(id) },
      data: {
        status,
        reviewNotes:  reviewNotes || null,
        reviewedBy:   req.user.id,
        reviewedAt:   new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: `تم تحديث حالة الطلب إلى: ${status}`,
      data: application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في مراجعة الطلب' });
  }
};
