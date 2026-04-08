import { Request, Response } from 'express';
import prisma from '../config/database';

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await prisma.financialTransaction.findMany({
      include: {
        project: { select: { title: true } },
        creator: { select: { fullName: true } }
      },
      orderBy: { transDate: 'desc' },
    });
    res.json({ success: true, data: transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب السجلات المالية' });
  }
};

export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, amount, category, description, projectId, transDate } = req.body;
    const trans = await prisma.financialTransaction.create({
      data: {
        type, amount: Number(amount), category, description,
        projectId: projectId ? Number(projectId) : null,
        transDate: transDate ? new Date(transDate) : new Date(),
        createdBy: req.user?.id
      }
    });
    
    // إذا كان منصرف مقيد بمشروع، نحدث ميزانيته
    if (type === 'expense' && projectId) {
      await prisma.budget.update({
        where: { projectId: Number(projectId) },
        data: { spentAmount: { increment: Number(amount) } }
      }).catch(() => null); // ignore if no specific budget is created yet
    }
    
    res.status(201).json({ success: true, message: 'تم إثبات المعاملة المالية', data: trans });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في إنشاء المعاملة' });
  }
};
