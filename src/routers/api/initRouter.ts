import { Router, Request, Response } from 'express';

const initRouter = Router();

initRouter.get('/', async (req: Request, res: Response) => {
  res.json({ name: '와우' });
});

export { initRouter };
