import { Request, Response } from 'express';
import prisma from '../config/database';

export const getVolunteers = async (req: Request, res: Response): Promise<void> => {
  try {
    const volunteers = await prisma.volunteer.findMany({
      include: { user: { select: { fullName: true, email: true, phone: true } } },
    });
    res.json({ success: true, data: volunteers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب بيانات المتطوعين' });
  }
};

export const createVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, skills, availability, notes } = req.body;
    if (!userId) {
      res.status(400).json({ success: false, message: 'حساب المستخدم مطلوب' });
      return;
    }
    const vol = await prisma.volunteer.create({
      data: {
        userId: Number(userId),
        skills, availability: availability || 'on_demand', notes,
        joinedDate: new Date()
      },
      include: { user: { select: { fullName: true } } }
    });
    res.status(201).json({ success: true, message: 'تم تسجيل المتطوع', data: vol });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في إضافة المتطوع' });
  }
};

export const updateVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { skills, availability, totalHours, isActive, notes } = req.body;
    const vol = await prisma.volunteer.update({
      where: { id: Number(id) },
      data: { skills, availability, totalHours: Number(totalHours), isActive, notes },
    });
    res.json({ success: true, message: 'تم تحديث بيانات المتطوع', data: vol });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في التحديث' });
  }
};
