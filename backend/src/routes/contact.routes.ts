import { Router } from 'express';
import { getContactMessages, createContactMessage } from '../controllers/contact.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public endpoint to send a message
router.post('/', createContactMessage);

// Protected endpoint to read messages (for admins)
router.get('/', authenticate, getContactMessages);

export default router;
