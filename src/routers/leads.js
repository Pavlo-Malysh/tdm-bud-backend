import { Hono } from 'hono';
import { getLeadsController, createLeadController } from '../controllers/leads.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createLeadSchema } from '../validation/project.js';

const router = new Hono();

router.get('/', getLeadsController);
router.post('/', validateBody(createLeadSchema), createLeadController);

export default router;
