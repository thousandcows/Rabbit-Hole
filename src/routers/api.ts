import { Router } from "express";
import initRouter from "./api/initRouter";

const apiRouter = Router();

apiRouter.use("/", initRouter);

export default apiRouter;
