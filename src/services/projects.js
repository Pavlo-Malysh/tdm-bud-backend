import { ProjectsCollection } from "../db/models/project.js";

export const getAllProjects = async () => {
    const projects = await ProjectsCollection.find();
    return projects;
};

export const getProjectById = async (projectId) => {
    const project = await ProjectsCollection.findById(projectId);
    return project;
};
