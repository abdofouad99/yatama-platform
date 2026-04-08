import { Request, Response } from 'express';
import prisma from '../config/database';

export const getPartners = async (req: Request, res: Response): Promise<void> => {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: partners });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب الشركاء' });
  }
};

export const createPartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, logoUrl, websiteUrl, type } = req.body;
    const partner = await prisma.partner.create({
      data: { name, logoUrl, websiteUrl, type }
    });
    res.status(201).json({ success: true, data: partner });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في إضافة الشريك' });
  }
};

export const updatePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, logoUrl, websiteUrl, type } = req.body;
    const partner = await prisma.partner.update({
      where: { id: Number(id) },
      data: { name, logoUrl, websiteUrl, type }
    });
    res.json({ success: true, data: partner });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في تعديل بيانات الشريك' });
  }
};

export const deletePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.partner.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'تم إزالة الشريك' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'فشل في إلغاء השותף' }); // الشريك
  }
};
