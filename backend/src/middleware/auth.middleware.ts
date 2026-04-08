import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

export interface AuthRequest extends Request {
  user?: { id: number; roleSlug: string; roleName: string };
}

// ==========================================
// التحقق من توكن JWT
// ==========================================
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'يجب تسجيل الدخول أولاً' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'الحساب غير مفعل أو غير موجود' });
      return;
    }

    req.user = {
      id:       user.id,
      roleSlug: user.role.slug,
      roleName: user.role.name,
    };

    next();
  } catch {
    res.status(401).json({ success: false, message: 'توكن غير صالح أو منتهي الصلاحية' });
  }
};

// ==========================================
// التحقق من الدور (Authorization)
// ==========================================
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'غير مصرح' });
      return;
    }

    if (!allowedRoles.includes(req.user.roleSlug)) {
      res.status(403).json({
        success: false,
        message: `ليس لديك صلاحية الوصول. الأدوار المسموحة: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
};
