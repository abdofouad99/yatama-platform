import { Request, Response } from 'express';
import prisma from '../config/database';

export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const employees = await prisma.employee.findMany({
      include: { user: { select: { fullName: true, email: true, phone: true } } },
    });
    res.json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب بيانات الموظفين' });
  }
};

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, position, department, salary, hireDate, contractType } = req.body;
    if (!userId) {
      res.status(400).json({ success: false, message: 'رقم المستخدم (userId) مطلوب للربط' });
      return;
    }
    const emp = await prisma.employee.create({
      data: {
        userId: Number(userId),
        position, department,
        salary: Number(salary) || 0,
        hireDate: hireDate ? new Date(hireDate) : new Date(),
        contractType: contractType || 'full_time'
      },
      include: { user: { select: { fullName: true } } }
    });
    res.status(201).json({ success: true, message: 'تم تعيين الموظف بنجاح', data: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في إنشاء سجل الموظف' });
  }
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { position, department, salary, contractType, isActive } = req.body;
    const emp = await prisma.employee.update({
      where: { id: Number(id) },
      data: { position, department, salary: Number(salary), contractType, isActive },
    });
    res.json({ success: true, message: 'تم تحديث بيانات الموظف', data: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في التحديث' });
  }
};

export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.employee.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'تم إزالة سجل الموظف' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الحذف' });
  }
};
