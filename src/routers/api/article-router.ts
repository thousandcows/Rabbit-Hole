import {
  Router, Request, Response, NextFunction,
} from 'express';
import { articleService } from '../../services';

const articleRouter = Router();

// 1. 새 게시글 작성
articleRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      articleType, author, authorId, title, content, carrots, tags,
    } = req.body;
    const articleInfo = {
      articleType, author, authorId, title, content, carrots, tags,
    };
    const result = await articleService.createArticle(articleInfo);
    res.status(200).json(result);
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
      articleType, filter, page, perPage,
    };
      // eslint-disable-next-line max-len
    const [articleList, totalPage] = await articleService.findArticles(searchCondition);
    res.status(200).json([articleList, totalPage]);
  } catch (error) {
    next(error);
  }
});
// 3. 게시글 조회
articleRouter.get('/:articleId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { articleId } = req.params;
    // eslint-disable-next-line max-len
    const articleInfo = await articleService.findArticle(articleId);
    res.status(200).json(articleInfo);
  } catch (error) {
    next(error);
  }
});
// 4. 게시글 제목, 내용 수정
articleRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { articleId } = req.query;
    const { title, content, tags } = req.body;
    const updatedArticle = await articleService.updateArticle({
      articleId, title, content, tags,
    });
    res.status(200).json(updatedArticle);
  } catch (error) {
    next(error);
  }
});
// 5. 게시글 삭제
articleRouter.delete('/:articleId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { articleId } = req.params;
    const result = await articleService.deleteArticle(articleId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
// 6. 게시글 좋아요
articleRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {

    //   res.status(200).json();
  } catch (error) {
    next(error);
  }
});
// 7. 게시글 검색
articleRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {

    //   res.status(200).json();
  } catch (error) {
    next(error);
  }
});

export { articleRouter };
