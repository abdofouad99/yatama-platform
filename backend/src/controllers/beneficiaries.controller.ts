import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /beneficiaries
export const getBeneficiaries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '50', governorate, gender } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (governorate) where.governorate = governorate;
    if (gender)      where.gender      = gender;

    const [beneficiaries, total] = await Promise.all([
      prisma.orphan.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: Number(limit) }),
      prisma.orphan.count({ where }),
    ]);
    res.json({ success: true, data: { beneficiaries, total, pagination: { page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) } } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطأ في جلب المستفيدين' });
  }
};

// POST /beneficiaries
export const createBeneficiary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, dateOfBirth, gender, governorate, guardianName, guardianPhone, notes } = req.body;
    if (!fullName || !dateOfBirth || !gender || !governorate) {
      res.status(400).json({ success: false, message: 'الاسم وتاريخ الميلاد والجنس والمحافظة مطلوبة' });
      return;
    }
    const b = await prisma.orphan.create({
      data: { fullName, dateOfBirth: new Date(dateOfBirth), gender, governorate, guardianName: guardianName || null, guardianPhone: guardianPhone || null, notes: notes || null },
    });
    res.status(201).json({ success: true, message: 'تم تسجيل المستفيد بنجاح', data: b });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في التسجيل' });
  }
};

// PUT /beneficiaries/:id
export const updateBeneficiary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, dateOfBirth, gender, governorate, guardianName, guardianPhone, notes } = req.body;
    const b = await prisma.orphan.update({
      where: { id: Number(id) },
      data: {
        ...(fullName     && { fullName }),
        ...(dateOfBirth  && { dateOfBirth: new Date(dateOfBirth) }),
        ...(gender       && { gender }),
        ...(governorate  && { governorate }),
        guardianName:  guardianName  || null,
        guardianPhone: guardianPhone || null,
        notes:         notes         || null,
      },
    });
    res.json({ success: true, message: 'تم تحديث البيانات بنجاح', data: b });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في التحديث' });
  }
};
