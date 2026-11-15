import { Hono } from 'hono';
import { getReviewsController, createReviewController } from '../controllers/reviews.js';

const router = new Hono();

router.get('/', getReviewsController);
router.post('/', createReviewController);

export default router;
