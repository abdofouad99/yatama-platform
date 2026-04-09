import { Request, Response } from 'express';
import prisma from '../config/database';

export const getPermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const perms = await prisma.permission.findMany({
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: perms });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب الصلاحيات' });
  }
};

export const createPermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const perm = await prisma.permission.create({
      data: { name, slug: name.toLowerCase().replace(/\s+/g, '-') }
    });
    res.status(201).json({ success: true, data: perm });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في إضافة الصلاحية' });
  }
};

export const updatePermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const perm = await prisma.permission.update({
      where: { id: Number(id) },
      data: { name, slug: name.toLowerCase().replace(/\s+/g, '-') }
    });
    res.json({ success: true, data: perm });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في تعديل الصلاحية' });
  }
};

export const deletePermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.permission.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'تم إزالة الصلاحية' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الحذف' });
  }
};
