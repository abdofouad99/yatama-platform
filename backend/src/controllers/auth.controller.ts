import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

// ==========================================
// POST /api/v1/auth/login
// ==========================================
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
      return;
    }

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: { permissions: { include: { permission: true } } },
        },
      },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, message: 'الحساب معطل، تواصل مع المشرف' });
      return;
    }

    // التحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
      return;
    }

    // إنشاء التوكن
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // تحديث آخر تسجيل دخول
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // استخراج الصلاحيات
    const permissions = user.role.permissions.map(rp => rp.permission.slug);

    res.status(200).json({
      success: true,
      message: `مرحباً ${user.fullName} 👋`,
      data: {
        token,
        user: {
          id:          user.id,
          fullName:    user.fullName,
          email:       user.email,
          phone:       user.phone,
          avatarUrl:   user.avatarUrl,
          role:        user.role.slug,
          roleName:    user.role.name,
          permissions,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'خطأ داخلي في الخادم' });
  }
};

// ==========================================
// GET /api/v1/auth/me
// ==========================================
export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, fullName: true, email: true,
        phone: true, avatarUrl: true, lastLogin: true,
        role: { select: { name: true, slug: true } },
      },
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ داخلي في الخادم' });
  }
};

// ==========================================
// POST /api/v1/auth/logout
// ==========================================
export const logout = (_req: Request, res: Response): void => {
  // في حالة الـ Access Tokens المُقصّرة، يكفي حذف التوكن من الـ Client
  res.status(200).json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
};
