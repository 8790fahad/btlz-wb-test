import { getStatus } from "#controllers/status.js";
import { Router } from "express";

const statusRouter = Router();

statusRouter.get("/status", getStatus);

export default statusRouter;
