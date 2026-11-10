import createHttpError from 'http-errors';
import { createProject, getAllProjects, getProjectById, updateProject } from "../services/projects.js";


export const getProjectsController = async (req, res) => {

    const projects = await getAllProjects();

    res.status(200).json({
        data: projects,
    });
};

export const getProjectByIdController = async (req, res, next) => {
    const { projectId } = req.params;
    const project = await getProjectById(projectId);

    if (!project) {
        throw createHttpError(404, 'Project not found');;
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found project with id ${projectId}`,
        data: project
    });
};

export const createProjectController = async (req, res) => {
    const project = await createProject(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully created a project!",
        data: project
    });
};

export const patchProjectController = async (req, res, next) => {
    const { projectId } = req.params;
    const result = await updateProject(projectId, req.body);

    if (!result) {
        next(createHttpError(404, "Project not found"));
        return;
    }

    res.json({
        status: 200,
        message: "Successfuly patched a project!",
        data: result.project
    });
};
