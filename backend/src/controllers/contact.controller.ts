import { Request, Response } from 'express';
import prisma from '../config/database';

export const getContactMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب الرسائل' });
  }
};

export const createContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const newMsg = await prisma.contactMessage.create({
      data: { name, email, phone, subject, message }
    });
    res.status(201).json({ success: true, data: newMsg });
  } catch (err) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة لاحقاً.' });
  }
};
