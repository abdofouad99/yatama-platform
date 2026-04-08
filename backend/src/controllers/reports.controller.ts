import { Request, Response } from 'express';
import prisma from '../config/database';

export const getFinancialReportSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalIncomeResult = await prisma.financialTransaction.aggregate({
      where: { type: 'income' },
      _sum: { amount: true }
    });
    const totalExpenseResult = await prisma.financialTransaction.aggregate({
      where: { type: 'expense' },
      _sum: { amount: true }
    });
    
    const donationsByProject = await prisma.donation.groupBy({
      by: ['projectId'],
      _sum: { amount: true },
      having: { projectId: { not: null } }
    });

    res.json({
      success: true,
      data: {
        totalIncome: totalIncomeResult._sum.amount || 0,
        totalExpense: totalExpenseResult._sum.amount || 0,
        netBalance: (totalIncomeResult._sum.amount || 0) - (totalExpenseResult._sum.amount || 0),
        donationsDistribution: donationsByProject
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'فشل استخراج التقرير المالي' });
  }
};
