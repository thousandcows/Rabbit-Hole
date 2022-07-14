import { Router } from 'express';
import {
  userRouter, chatRouter, articleRouter, searchRouter, commentRouter, authRouter,
} from './api/index';
import { projectRouter } from './api/project-router';

const apiRouter = Router();
apiRouter.use('/users', userRouter);
apiRouter.use('/chats', chatRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/search', searchRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/projects', projectRouter);
export { apiRouter };
