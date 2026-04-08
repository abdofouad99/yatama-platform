import { Router } from 'express';
import { createStory, updateStory, deleteStory, togglePublishStory } from '../controllers/stories.controller';
import { createNews, updateNews, deleteNews } from '../controllers/news.controller';
import { createPartner, updatePartner, deletePartner } from '../controllers/partners.controller';
import { uploadTransparencyReport, updateTransparencyReport, deleteTransparencyReport } from '../controllers/transparency.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protect all CMS routes
router.use(authenticate);

router.post('/stories', createStory);
router.put('/stories/:id', updateStory);
router.patch('/stories/:id/publish', togglePublishStory);
router.delete('/stories/:id', deleteStory);

router.post('/news', createNews);
router.put('/news/:id', updateNews);
router.delete('/news/:id', deleteNews);

router.post('/partners', createPartner);
router.put('/partners/:id', updatePartner);
router.delete('/partners/:id', deletePartner);

router.post('/transparency', uploadTransparencyReport);
router.put('/transparency/:id', updateTransparencyReport);
router.delete('/transparency/:id', deleteTransparencyReport);

export default router;
