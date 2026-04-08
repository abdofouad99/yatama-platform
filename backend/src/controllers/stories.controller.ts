import { Request, Response } from 'express';
import prisma from '../config/database';

export const getStories = async (req: Request, res: Response): Promise<void> => {
  try {
    const stories = await prisma.story.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: stories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب القصص' });
  }
};

export const createStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, summary, content, imageUrl, beneficiaryType } = req.body;
    const story = await prisma.story.create({
      data: { title, summary, content, imageUrl, beneficiaryType, isPublished: true }
    });
    res.status(201).json({ success: true, data: story });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في إنشاء القصة' });
  }
};

export const updateStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, summary, content, imageUrl, beneficiaryType } = req.body;
    const story = await prisma.story.update({
      where: { id: Number(id) },
      data: { title, summary, content, imageUrl, beneficiaryType }
    });
    res.json({ success: true, data: story });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في تحديث القصة' });
  }
};

export const togglePublishStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;
    const story = await prisma.story.update({
      where: { id: Number(id) },
      data: { isPublished: Boolean(isPublished) }
    });
    res.json({ success: true, data: story });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في تغيير حالة النشر' });
  }
};

export const deleteStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.story.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'تم الحذف بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في حذف القصة' });
  }
};
