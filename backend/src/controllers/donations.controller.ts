import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// ==========================================
// POST /api/v1/donations
// ==========================================
export const createDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      donorName, donorEmail, donorPhone,
      projectId, amount, currency = 'USD',
      type = 'one_time', paymentMethod = 'bank_transfer',
      isAnonymous = false, notes,
    } = req.body;

    if (!donorName || !donorEmail || !amount || Number(amount) <= 0) {
      res.status(400).json({ success: false, message: 'الاسم والبريد الإلكتروني والمبلغ مطلوبة' });
      return;
    }

    // إنشاء أو البحث عن المتبرع
    let donor = await prisma.donor.findFirst({ where: { email: donorEmail } });
    if (!donor) {
      donor = await prisma.donor.create({
        data: { fullName: donorName, email: donorEmail, phone: donorPhone, isAnonymous: Boolean(isAnonymous) },
      });
    }

    const receiptNumber = `YCF-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const donation = await prisma.donation.create({
      data: {
        donorId:       donor.id,
        projectId:     projectId ? Number(projectId) : undefined,
        amount:        Number(amount),
        currency,
        type,
        paymentMethod,
        receiptNumber,
        status:        'pending',
        notes,
      },
    });

    // تحديث إجمالي المتبرع
    await prisma.donor.update({
      where: { id: donor.id },
      data:  { totalDonated: { increment: Number(amount) } },
    });

    // تحديث المبلغ الحالي للمشروع إن وُجد
    if (projectId) {
      await prisma.project.update({
        where: { id: Number(projectId) },
        data:  { currentAmount: { increment: Number(amount) } },
      });
    }

    res.status(201).json({
      success: true,
      message: 'تم استقبال تبرعك بنجاح 🤲 جزاك الله خيراً',
      data: { donationId: donation.id, receiptNumber: donation.receiptNumber },
    });
  } catch (error: any) {
    console.error('createDonation error:', error);
    res.status(500).json({ success: false, message: 'خطأ في معالجة التبرع' });
  }
};

// ==========================================
// GET /api/v1/donations
// ==========================================
export const getDonations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '20', status } = req.query;
    const skip  = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (status) where.status = status;

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        include: {
          donor:   { select: { fullName: true, email: true } },
          project: { select: { title: true } },
        },
        orderBy: { donatedAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.donation.count({ where }),
    ]);

    const totals = await prisma.donation.aggregate({
      where: { status: 'completed' },
      _sum:  { amount: true },
    });

    res.status(200).json({
      success: true,
      data: {
        donations,
        totals:     { totalCompleted: totals._sum.amount || 0 },
        pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في جلب التبرعات' });
  }
};
