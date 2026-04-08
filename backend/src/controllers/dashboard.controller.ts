import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// ==========================================
// GET /api/v1/dashboard/stats
// ==========================================
export const getDashboardStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalDonations,
      totalDonors,
      totalProjects,
      activeProjects,
      pendingApplications,
      recentDonations,
      recentApplications,
      donationsByMonth,
      totalOrphans,
      totalFamilies,
      uncompletedTasks,
    ] = await Promise.all([
      // إجمالي التبرعات المكتملة
      prisma.donation.aggregate({
        where: { status: 'completed' },
        _sum: { amount: true },
        _count: true,
      }),
      // عدد المتبرعين
      prisma.donor.count(),
      // عدد المشاريع الكلي
      prisma.project.count(),
      // عدد المشاريع النشطة
      prisma.project.count({ where: { status: 'active' } }),
      // طلبات المستفيدين المعلقة
      prisma.onlineApplication.count({ where: { status: 'pending' } }),
      // آخر 5 تبرعات
      prisma.donation.findMany({
        take: 5,
        orderBy: { donatedAt: 'desc' },
        include: {
          donor:   { select: { fullName: true, isAnonymous: true } },
          project: { select: { title: true } },
        },
      }),
      // آخر 5 طلبات
      prisma.onlineApplication.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, applicantName: true, status: true,
          membersCount: true, createdAt: true,
        },
      }),
      // تبرعات آخر 6 أشهر (مبسط)
      prisma.donation.findMany({
        where: {
          status: 'completed',
          donatedAt: {
            gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          },
        },
        select: { amount: true, donatedAt: true },
        orderBy: { donatedAt: 'asc' },
      }),
      // عدد الأيتام
      prisma.orphan.count(),
      // عدد الأسر
      prisma.family.count(),
      // عدد المهام غير المكتملة
      prisma.task.count({ where: { status: { not: 'completed' } } }),
    ]);

    // تجميع التبرعات شهرياً
    const monthlyMap: Record<string, number> = {};
    for (const d of donationsByMonth) {
      const key = d.donatedAt.toISOString().substring(0, 7); // YYYY-MM
      monthlyMap[key] = (monthlyMap[key] || 0) + Number(d.amount);
    }
    const monthlyData = Object.entries(monthlyMap).map(([month, amount]) => ({ month, amount }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalDonationsAmount: totalDonations._sum.amount || 0,
          totalDonationsCount:  totalDonations._count,
          totalDonors,
          totalProjects,
          activeProjects,
          pendingApplications,
          totalOrphans,
          totalFamilies,
          uncompletedTasks,
        },
        recentDonations,
        recentApplications,
        monthlyData,
      },
    });
  } catch (error: any) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ success: false, message: 'خطأ في جلب إحصائيات لوحة التحكم' });
  }
};
