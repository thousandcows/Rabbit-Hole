import { Router } from 'express';
import {
  userRouter,
  chatRouter,
  articleRouter,
  searchRouter,
  commentRouter,
  authRouter,
  imageRouter,
  adminRouter,
} from './api/index';
import { projectRouter } from './api/project-router';
import { loginRequired, adminRequired } from '../middlewares';

const apiRouter = Router();
apiRouter.use('/users', userRouter);
apiRouter.use('/chats', chatRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/search', searchRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/admin', loginRequired, adminRequired, adminRouter);
apiRouter.use('/projects', projectRouter);
apiRouter.use('/images', imageRouter);
export { apiRouter };
