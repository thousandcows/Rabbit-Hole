import {
  Router, Request, Response, NextFunction,
} from 'express';
import { loginRequired } from '../../middlewares/login-required';
import { commentService } from '../../services';
import { contentTypeChecker } from '../../utils/content-type-checker';
import { validation } from '../../utils/validation';

const commentRouter = Router();

// 댓글 작성
commentRouter.post('/', loginRequired, async (req:Request, res:Response, next:NextFunction) => {
  try {
    const commentInfo = req.body;
    contentTypeChecker(commentInfo);

    validation.isLogin(req.currentUserId);

    const newComment = await commentService.addComment(commentInfo);
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

// 특정 게시글에 작성된 댓글 가져오기
commentRouter.get('/:articleId', loginRequired, async (req:Request, res:Response, next :NextFunction) => {
  try {
    validation.isLogin(req.currentUserId);

    const { articleId } = req.params;
    const comments = await commentService.getCommentsByArticleId(articleId);
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

// 특정 유저가 작성한 댓글 가져오기
commentRouter.get('/:authorId', loginRequired, async (req:Request, res:Response, next :NextFunction) => {
  try {
    validation.isLogin(req.currentUserId);

    const { authorId } = req.params;
    const comments = await commentService.getCommentsByAuthorId(authorId);
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

// 댓글 수정, 채택
commentRouter.put('/:commentId', loginRequired, async (req:Request, res:Response, next:NextFunction) => {
  try {
    const userId = validation.isLogin(req.currentUserId);

    const { commentId } = req.params;
    const { update } = req.body;

    const updatedComment = await commentService.setComment(userId, commentId, update);
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
});

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
