import {
  Router, Request, Response, NextFunction,
} from 'express';
import { loginRequired } from '../../middlewares';
import { commentService } from '../../services';
import { validation } from '../../utils/validation';

const commentRouter = Router();

// 댓글 조회
commentRouter.get('/:articleId', loginRequired, async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { articleId } = req.params;
    const { page, perPage } = req.query;
    const searchCondition = { articleId, page: Number(page), perPage: Number(perPage) };
    const [
      commentList, totalPage,
    ] = await commentService.getCommentsByArticleId(searchCondition);
    res.status(200).json({ commentList, totalPage });
  } catch (error) {
    next(error);
  }
});

// 댓글 작성
commentRouter.post('/:articleId', loginRequired, async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { articleId } = req.params;
    const commentInfo = req.body;

    const userId = validation.isLogin(req.currentUserId);

    const newComment = await commentService.addComment(userId, articleId, commentInfo);
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

// 댓글 수정
commentRouter.put('/:commentId', loginRequired, async (req:Request, res:Response, next:NextFunction) => {
  try {
    const userId = validation.isLogin(req.currentUserId);

    const { commentId } = req.params;
    const update = req.body;

    const updatedComment = await commentService.setComment(userId, commentId, update);
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
});

// 댓글 채택
commentRouter.put(
  '/:commentId/adoption',
  loginRequired,
  async (req:Request, res:Response, next:NextFunction) => {
    try {
      const userId = validation.isLogin(req.currentUserId);

      const { commentId } = req.params;
      const update = req.body;

      const updatedComment = await commentService.adoptComment(userId, commentId, update);
      res.status(200).json(updatedComment);
    } catch (error) {
      next(error);
    }
  },
);

// 댓글 하나 삭제
commentRouter.delete('/:commentId', loginRequired, async (req: Request, res:Response, next:NextFunction) => {
  try {
    const userId = validation.isLogin(req.currentUserId);
    const { commentId } = req.params;

    const deletedComment = await commentService.deleteCommentsById(userId, commentId);
    res.status(200).json(deletedComment);
  } catch (error) {
    next(error);
  }
});

export { commentRouter };
