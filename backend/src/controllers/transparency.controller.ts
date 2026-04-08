import { Request, Response } from 'express';
import prisma from '../config/database';

export const getTransparencyData = async (req: Request, res: Response): Promise<void> => {
  try {
    // جلب التقارير التي حملها المشرف
    const downloadableReports = await prisma.transparencyReport.findMany({
      orderBy: { year: 'desc' }
    });

    res.json({
      success: true,
      data: {
        budgetAllocations: [
          { label: 'المشاريع الإغاثية', percentage: 40 },
          { label: 'كفالة الأيتام', percentage: 35 },
          { label: 'النفقات التشغيلية', percentage: 15 },
          { label: 'التسويق والدعاية', percentage: 10 },
        ],
        downloadableReports
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب بيانات الشفافية' });
  }
};

export const uploadTransparencyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, fileUrl, year } = req.body;
    const report = await prisma.transparencyReport.create({
      data: { title, description, fileUrl, year: Number(year) }
    });
    res.status(201).json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في حفظ التقرير' });
  }
};

export const updateTransparencyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, fileUrl, year } = req.body;
    const report = await prisma.transparencyReport.update({
      where: { id: Number(id) },
      data: { title, description, fileUrl, year: Number(year) }
    });
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في تعديل التقرير' });
  }
};

export const deleteTransparencyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.transparencyReport.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'تم حذف التقرير' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الحذف' });
  }
};
