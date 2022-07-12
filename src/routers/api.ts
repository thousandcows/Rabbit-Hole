import { Router } from 'express';
import { userRouter, chatRouter, commentRouter } from './api/index';

const apiRouter = Router();
apiRouter.use('/users', userRouter);
apiRouter.use('/chats', chatRouter);
apiRouter.use('/comments', commentRouter);

export { apiRouter };
