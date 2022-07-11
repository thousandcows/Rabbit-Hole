import { Router } from 'express';
import { userRouter } from './api/index';

const apiRouter = Router();

apiRouter.use('/users', userRouter);

export { apiRouter };
