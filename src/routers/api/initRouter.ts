import { Router, Request, Response, NextFunction } from "express";

const initRouter = Router();

initRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.json({ name: "와우" });
});

export default initRouter;
