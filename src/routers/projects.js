import { Hono } from 'hono';
import {
    getProjectsController,
    getProjectByIdController,
    createProjectController,
    patchProjectController,
} from '../controllers/projects.js';

const router = new Hono();

router.get('/', getProjectsController);
router.get('/:projectId', getProjectByIdController);
router.post('/', createProjectController);
router.patch('/:projectId', patchProjectController);

export default router;
