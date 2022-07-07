import { Router } from 'express';
import { initRouter } from './api/index';

const apiRouter = Router();

apiRouter.use('/', initRouter);

export { apiRouter };
