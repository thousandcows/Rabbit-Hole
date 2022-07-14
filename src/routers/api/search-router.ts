import {
  Router, Request, Response, NextFunction,
} from 'express';
import { articleService, projectService } from '../../services';

const searchRouter = Router();

// 1. 게시글 검색
searchRouter.get('/article', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.query.author && req.query.type) {
      const { author, type } = req.query;
      // eslint-disable-next-line max-len
      const articles = await articleService.searchArticlesByAuthor(author.toString(), type?.toString());
      res.status(200).json(articles);
    } else if (req.query.title && req.query.type) {
      const { title, type } = req.query;
      // eslint-disable-next-line max-len
      const articles = await articleService.searchArticlesByTitle(title.toString(), type?.toString());
      res.status(200).json(articles);
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
