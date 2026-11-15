import { HTTPException } from 'hono/http-exception';
import { getDb } from '../db/mongo.js';
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
} from '../services/projects.js';

export const getProjectsController = async (c) => {
    const projects = await getAllProjects(await getDb(c.env));
    return c.json({ status: 200, data: projects });
};

export const getProjectByIdController = async (c) => {
    const project = await getProjectById(await getDb(c.env), c.req.param('projectId'));
    if (!project) throw new HTTPException(404, { message: 'Project not found' });
    return c.json({ status: 200, data: project });
};

export const createProjectController = async (c) => {
    const project = await createProject(await getDb(c.env), await c.req.json());
    return c.json({ status: 201, message: 'Successfully created a project!', data: project }, 201);
};

export const patchProjectController = async (c) => {
    const project = await updateProject(
        await getDb(c.env),
        c.req.param('projectId'),
        await c.req.json(),
    );
    if (!project) throw new HTTPException(404, { message: 'Project not found' });
    return c.json({ status: 200, message: 'Successfully patched a project!', data: project });
};
