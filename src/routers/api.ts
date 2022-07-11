import { Router } from 'express';
import { userRouter, chatRouter } from './api/index';

const apiRouter = Router();
apiRouter.use('/users', userRouter);
apiRouter.use('/chats', chatRouter);

export { apiRouter };
