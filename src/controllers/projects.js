import createHttpError from 'http-errors';
import { getAllProjects, getProjectById } from "../services/projects.js";


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
