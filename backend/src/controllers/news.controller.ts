import { Request, Response } from 'express';
import prisma from '../config/database';

export const getNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const news = await prisma.newsArticle.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json({ success: true, data: news });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب الأخبار' });
  }
};

export const createNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, summary, content, imageUrl } = req.body;
    const newsArticle = await prisma.newsArticle.create({
      data: { title, summary, content, imageUrl, isPublished: true }
    });
    res.status(201).json({ success: true, data: newsArticle });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في إنشاء الخبر' });
  }
};

export const updateNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, summary, content, imageUrl } = req.body;
    const news = await prisma.newsArticle.update({
      where: { id: Number(id) },
      data: { title, summary, content, imageUrl }
    });
    res.json({ success: true, data: news });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في تحديث الخبر' });
  }
};

export const deleteNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.newsArticle.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'تم حذف الخبر' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الحذف' });
  }
};
