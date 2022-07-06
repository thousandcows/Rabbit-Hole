import { Router } from "express";
import { initRouter } from "./api/";

const apiRouter = Router();

apiRouter.use("/", initRouter);

export { apiRouter };
