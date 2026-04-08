import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /users
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, fullName: true, email: true, phone: true,
        isActive: true, lastLogin: true, createdAt: true,
        role: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: { users, total: users.length } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب المستخدمين' });
  }
};

// POST /users
export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, roleId, password } = req.body;
    if (!fullName || !email || !password) {
      res.status(400).json({ success: false, message: 'الاسم والبريد وكلمة المرور مطلوبة' });
      return;
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) { res.status(409).json({ success: false, message: 'البريد الإلكتروني مستخدم بالفعل' }); return; }

    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { fullName, email, phone: phone || null, password: hash, roleId: Number(roleId) || 5, isActive: true },
      select: { id: true, fullName: true, email: true, role: { select: { name: true, slug: true } } },
    });
    res.status(201).json({ success: true, message: 'تم إنشاء المستخدم بنجاح', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في إنشاء المستخدم' });
  }
};

// PUT /users/:id
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, roleId, password } = req.body;
    const updateData: any = {};
    if (fullName) updateData.fullName = fullName;
    if (email)    updateData.email    = email;
    if (phone !== undefined) updateData.phone = phone || null;
    if (roleId)   updateData.roleId   = Number(roleId);
    if (password) updateData.password = await bcrypt.hash(password, 12);

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
      select: { id: true, fullName: true, email: true, role: { select: { name: true, slug: true } } },
    });
    res.json({ success: true, message: 'تم تحديث المستخدم بنجاح', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في تحديث المستخدم' });
  }
};

// PATCH /users/:id/toggle — تفعيل/تعطيل
export const toggleUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) { res.status(404).json({ success: false, message: 'المستخدم غير موجود' }); return; }
    const updated = await prisma.user.update({ where: { id: Number(id) }, data: { isActive: !user.isActive } });
    res.json({ success: true, message: `تم ${updated.isActive ? 'تفعيل' : 'تعطيل'} المستخدم`, data: { isActive: updated.isActive } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في تحديث الحالة' });
  }
};
