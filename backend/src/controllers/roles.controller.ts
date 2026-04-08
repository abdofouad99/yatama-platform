import { Request, Response } from 'express';
import prisma from '../config/database';

export const getRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await prisma.role.findMany({ include: { permissions: true } });
    res.json({ success: true, data: roles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب الأدوار' });
  }
};

export const createRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, permissions } = req.body;
    // permissions is an array of permission names to attach
    const slug = name.toLowerCase().replace(/\s+/g, '_');
    const role = await prisma.role.create({
      data: {
        name,
        slug,
        permissions: {
          connectOrCreate: permissions.map((p: string) => ({
            where: { name: p },
            create: { name: p, description: p }
          }))
        }
      }
    });
    res.status(201).json({ success: true, data: role });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في إنشاء الدور' });
  }
};

export const updateRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;
    const slug = name ? name.toLowerCase().replace(/\s+/g, '_') : undefined;
    const role = await prisma.role.update({
      where: { id: Number(id) },
      data: {
        name,
        ...(slug && { slug }),
        permissions: {
          set: [], // clear existing
          connectOrCreate: permissions?.map((p: string) => ({
            where: { name: p },
            create: { name: p, description: p }
          })) || []
        }
      }
    });
    res.json({ success: true, data: role });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في تعديل الدور' });
  }
};

export const deleteRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.role.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'تم حذف الدور' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'فشل الحذف' });
  }
};
