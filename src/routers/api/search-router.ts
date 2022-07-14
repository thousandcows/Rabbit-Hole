import {
  Router, Request, Response, NextFunction,
} from 'express';
import { articleService, projectService } from '../../services';

const searchRouter = Router();

// 1. 게시글 검색
searchRouter.get('/articles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.query.author && req.query.articleType) {
      const {
        author, articleType, filter, page, perPage,
      } = req.query;
      const authorSearchCondition = {
        author: String(author),
        articleType: String(articleType),
        filter: String(filter),
        page: Number(page),
        perPage: Number(perPage),
      };
      const [articleList, totalPage] = await articleService
        .searchArticlesByAuthor(authorSearchCondition);
      res.status(200).json({ articleList, totalPage });
    } else if (req.query.title && req.query.articleType) {
      const {
        title, articleType, filter, page, perPage,
      } = req.query;
      const titleSearchCondition = {
        title: String(title),
        articleType: String(articleType),
        filter: String(filter),
        page: Number(page),
        perPage: Number(perPage),
      };
      const [articleList, totalPage] = await articleService
        .searchArticlesByTitle(titleSearchCondition);
      res.status(200).json({ articleList, totalPage });
    }
  } catch (error) {
    next(error);
  }
});

// 1. 프로젝트 게시글 검색
searchRouter.get('/projects', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.query.author) {
      const { author } = req.query;
      // eslint-disable-next-line max-len
      const projects = await projectService.searchProjectsByAuthor(author.toString());
      res.status(200).json(projects);
    } else if (req.query.title) {
      const { title } = req.query;
      // eslint-disable-next-line max-len
      const projects = await projectService.searchProjectsByTitle(title.toString());
      res.status(200).json(projects);
    }
  } catch (error) {
    next(error);
  }
});

export { searchRouter };
