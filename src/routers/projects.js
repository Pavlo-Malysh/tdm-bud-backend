import { Router } from "express";
import { createProjectController, createReviewController, getProjectByIdController, getProjectsController, getReviewsController, patchProjectController } from "../controllers/projects.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();


router.get("/projects", ctrlWrapper(getProjectsController));

router.get("/reviews", ctrlWrapper(getReviewsController));

router.get("/projects/{:projectId}", ctrlWrapper(getProjectByIdController));

router.post("/projects", ctrlWrapper(createProjectController));

router.post("/reviews", ctrlWrapper(createReviewController));

router.patch("/projects/{:projectId}", ctrlWrapper(patchProjectController));

export default router;
