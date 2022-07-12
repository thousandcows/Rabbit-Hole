import { Router } from 'express';
import { userRouter, commentRouter } from './api/index';

const apiRouter = Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/comments', commentRouter);

export { apiRouter };
