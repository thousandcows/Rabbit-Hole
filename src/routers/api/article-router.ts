import {
  Router, Request, Response, NextFunction,
} from 'express';
import { loginRequired } from '../../middlewares/login-required';
import { articleService } from '../../services';
import { validation } from '../../utils/validation';

const articleRouter = Router();

// 1. 새 게시글 작성
articleRouter.post('/', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = validation.isLogin(req.currentUserId);
    const {
      articleType, author, title, content, carrots, tags,
    } = req.body;
    const articleInfo = {
      articleType, author, authorId: userId, title, content, carrots, tags,
    };
    const result = await articleService.createArticle(userId, articleInfo);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});
// 2. 전체 게시글 조회
articleRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      articleType, filter, page, perPage,
    } = req.query;
    const searchCondition = {
      articleType: String(articleType),
      filter: String(filter),
      page: Number(page),
      perPage: Number(perPage),
    };
      // eslint-disable-next-line max-len
    const [articleList, totalPage] = await articleService.findArticles(searchCondition);
    res.status(200).json({ articleList, totalPage });
  } catch (error) {
    next(error);
  }
});
// 3. 게시글 조회
articleRouter.get('/:articleId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { articleId } = req.params;
    const { page, perPage } = req.query;
    const commentSearchCondition = { articleId, page: Number(page), perPage: Number(perPage) };
    const [
      articleInfo,
      commentList,
      commentTotalPage] = await articleService.findArticle(commentSearchCondition);
    res.status(200).json({ articleInfo, commentList, commentTotalPage });
  } catch (error) {
    next(error);
  }
});
// 4. 게시글 제목, 내용 수정
articleRouter.put('/:articleId', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = validation.isLogin(req.currentUserId);
    const { articleId } = req.params;
    const { title, content, tags } = req.body;
    const updatedArticle = await articleService.updateArticle(userId, {
      articleId, title, content, tags,
    });
    res.status(200).json(updatedArticle);
  } catch (error) {
    next(error);
  }
});
// 5. 게시글 삭제
articleRouter.delete('/:articleId', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = validation.isLogin(req.currentUserId);
    const { articleId } = req.params;
    const result = await articleService.deleteArticle(userId, articleId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
// 6. 게시글 좋아요
articleRouter.put('/:articleId/heart', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = validation.isLogin(req.currentUserId);
    const { articleId } = req.params;
    const result = await articleService.likeArticle(userId, articleId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});


export { articleRouter };
