import { Router } from 'express';
import { getStories } from '../controllers/stories.controller';
import { getTransparencyData } from '../controllers/transparency.controller';
import { getPartners } from '../controllers/partners.controller';
import { getNews } from '../controllers/news.controller';

const router = Router();

router.get('/stories', getStories);
router.get('/transparency', getTransparencyData);
router.get('/partners', getPartners);
router.get('/news', getNews);

export default router;
