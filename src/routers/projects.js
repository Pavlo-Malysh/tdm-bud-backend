import { Router } from "express";
import { createProjectController, getProjectByIdController, getProjectsController, patchProjectController } from "../controllers/projects.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createReviewController, getReviewsController } from "../controllers/reviews.js";
import { createLeadController, getLeadsController } from "../controllers/leads.js";

const router = Router();


router.get("/projects", ctrlWrapper(getProjectsController));

router.get("/reviews", ctrlWrapper(getReviewsController));

router.get("/leads", ctrlWrapper(getLeadsController));

router.get("/projects/{:projectId}", ctrlWrapper(getProjectByIdController));



router.post("/projects", ctrlWrapper(createProjectController));

router.post("/reviews", ctrlWrapper(createReviewController));

router.post("/leads", ctrlWrapper(createLeadController));




router.patch("/projects/{:projectId}", ctrlWrapper(patchProjectController));

export default router;
