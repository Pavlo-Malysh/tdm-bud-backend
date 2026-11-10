import { ProjectsCollection } from "../db/models/project.js";
import { ReviewsCollection } from "../db/models/reviews.js";
import { LeadsCollection } from "../db/models/user.js";

export const getAllProjects = async () => {
    const projects = await ProjectsCollection.find();
    return projects;
};

export const getProjectById = async (projectId) => {
    const project = await ProjectsCollection.findById(projectId);
    return project;
};

export const createProject = async (payload) => {
    const project = await ProjectsCollection.create(payload);
    return project;
};

export const updateProject = async (projectId, payload, options = {}) => {
    const result = await ProjectsCollection.findOneAndUpdate({ _id: projectId }, payload, {
        includeResultMetadata: true,
        ...options,
    });

    if (!result || !result.value) return null;

    return {
        project: result.value,
        isNew: Boolean(result?.lastErrorObject?.upserted),
    };
};


export const getAllReviews = async () => {
    const reviews = await ReviewsCollection.find();
    return reviews;
};


export const createReview = async (payload) => {
    const review = await ReviewsCollection.create(payload);
    return review;
};

export const createLead = async (payload) => {
    const lead = await LeadsCollection.create(payload);
    return lead;
};

export const getAllLeads = async () => {
    const leads = await LeadsCollection.find();
    return leads;
};
