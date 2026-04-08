import { Request, Response } from 'express';
import prisma from '../config/database';

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignee: { select: { fullName: true } },
        project: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب المهام' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;
    const task = await prisma.task.create({
      data: {
        title, description,
        projectId: projectId ? Number(projectId) : null,
        assignedTo: assignedTo ? Number(assignedTo) : null,
        assignedBy: (req as any).user?.id || 1,
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });
    res.status(201).json({ success: true, message: 'تم إنشاء المهمة', data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في إنشاء المهمة' });
  }
};

export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { status, completedAt: status === 'completed' ? new Date() : null }
    });
    res.json({ success: true, message: 'تم تحديث حالة المهمة', data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في تحديث المهمة' });
  }
};
