import { Request, Response } from 'express';
import prisma from '../config/database';

export const getBudgets = async (req: Request, res: Response): Promise<void> => {
  try {
    const budgets = await prisma.budget.findMany({
      include: { project: { select: { title: true, status: true } } }
    });
    res.json({ success: true, data: budgets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في استعلام الميزانيات' });
  }
};

export const setBudget = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, totalAmount, fiscalYear, notes } = req.body;
    const budget = await prisma.budget.upsert({
      where: { projectId: Number(projectId) },
      update: { totalAmount: Number(totalAmount), fiscalYear: Number(fiscalYear), notes },
      create: { projectId: Number(projectId), totalAmount: Number(totalAmount), fiscalYear: Number(fiscalYear), notes }
    });
    res.json({ success: true, message: 'تم تخصيص الميزانية بنجاح', data: budget });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في إعداد الميزانية' });
  }
};
