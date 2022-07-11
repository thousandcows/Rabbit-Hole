import {
  Router, Request, Response, NextFunction,
} from 'express';
import { loginRequired } from '../../middlewares/login-required';
import { commentService } from '../../services';
import { contentTypeChecker } from '../../utils/content-type-checker';

const commentRouter = Router();

commentRouter.post('/', loginRequired, async (req:Request, res:Response, next:NextFunction) => {
  try {
    const commentInfo = req.body;
    contentTypeChecker(commentInfo);

    const userId = req.currentUserId;
    if (!userId) {
      const error = new Error('로그인 후 확인 가능합니다.');
      error.name = 'Unauthorized';
      throw error;
    }
    const newComment = await commentService.addComment(commentInfo);
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
});

export { commentRouter };
