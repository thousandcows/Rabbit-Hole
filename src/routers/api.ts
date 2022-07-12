import { Router } from 'express';
import { userRouter, chatRouter, articleRouter } from './api/index';

const apiRouter = Router();
apiRouter.use('/users', userRouter);
apiRouter.use('/chats', chatRouter);
apiRouter.use('/articles', articleRouter);

export { apiRouter };
