import { Router } from "express";
import { getProjectByIdController, getProjectsController } from "../controllers/projects.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();


router.get("/projects", ctrlWrapper(getProjectsController));

router.get("/projects/{:projectId}", ctrlWrapper(getProjectByIdController));



export default router;
