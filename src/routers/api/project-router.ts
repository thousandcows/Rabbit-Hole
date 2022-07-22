import {
  Router, Response, NextFunction,
} from 'express';
import { loginRequired } from '../../middlewares/login-required';
import { projectService } from '../../services';
import { validation } from '../../utils/validation';
import { upload } from '../../utils/multer-s3';

const projectRouter = Router();

// 1. 새 게시글 작성
projectRouter.post('/', loginRequired, upload.single('thumbnail'), async (req: any, res: Response, next: NextFunction) => {
  try {
    const image: any = req.file;
    if (image) {
      req.body.tags = JSON.parse(req.body.tags);
      const userId = validation.isLogin(req.currentUserId);
      const thumbnail = image.location;
      const {
        author, title, shortDescription, description, tags,
      } = req.body;
      const projectInfo = {
        author, authorId: userId, title, shortDescription, description, thumbnail, tags,
      };
      const result = await projectService.createProject(userId, projectInfo);
      res.status(201).json(result);
    } else {
      const error = new Error('이미지 업로드에 실패하였습니다');
      error.name = 'NotFound';
      throw error;
    }
  } catch (error) {
    next(error);
  }
});
// 2. 전체 게시글 조회
projectRouter.get('/', async (req: any, res: Response, next: NextFunction) => {
  try {
    const {
      filter, page, perPage,
    } = req.query;
    const searchCondition = {
      filter: String(filter),
      page: Number(page),
      perPage: Number(perPage),
    };
    // eslint-disable-next-line max-len
    const [projectList, totalPage] = await projectService.findProjects(searchCondition);
    res.status(200).json({ projectList, totalPage });
  } catch (error) {
    next(error);
  }
});
// 3-1. 게시글 조회 - 게시글 아이디 - 조회수 변화없음
projectRouter.get('/:projectId/const', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const { page, perPage } = req.query;
    const commentSearchCondition = { projectId, page: Number(page), perPage: Number(perPage) };
    const [
      projectInfo,
      commentList,
      commentTotalPage] = await projectService.findProject(commentSearchCondition);
    res.status(200).json({ projectInfo, commentList, commentTotalPage });
  } catch (error) {
    next(error);
  }
});

// 3-2. 게시글 조회 - 게시글 아이디 - 조회수 증가
projectRouter.get('/:projectId', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const { page, perPage } = req.query;
    const commentSearchCondition = { projectId, page: Number(page), perPage: Number(perPage) };
    const [
      projectInfo,
      commentList,
      commentTotalPage] = await projectService.findProjectViews(commentSearchCondition);
    res.status(200).json({ projectInfo, commentList, commentTotalPage });
  } catch (error) {
    next(error);
  }
});

// 4. 게시글 제목, 내용 수정
projectRouter.put('/:projectId', loginRequired, upload.single('thumbnail'), async (req: any, res: Response, next: NextFunction) => {
  try {
    const image: any = req.file;
    const { projectId } = req.params;
    let thumbnail: string = '';
    if (image) {
      thumbnail = image.location;
    } else {
      const project = await projectService.findProjectOne(projectId);
      if (project) thumbnail = project.thumbnail;
    }
    if (req.body.tags) req.body.tags = JSON.parse(req.body.tags);
    const userId = validation.isLogin(req.currentUserId);
    const {
      author, title, shortDescription, description, tags,
    } = req.body;
    const updatedArticle = await projectService.updateProject(userId, {
      author, projectId, title, shortDescription, description, thumbnail, tags,
    });
    res.status(200).json(updatedArticle);
  } catch (error) {
    next(error);
  }
});
// 5. 게시글 삭제
projectRouter.delete('/:projectId', loginRequired, async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = validation.isLogin(req.currentUserId);
    const { projectId } = req.params;
    const result = await projectService.deleteProject(userId, projectId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
// 6. 게시글 좋아요
projectRouter.put('/:projectId/heart', loginRequired, async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = validation.isLogin(req.currentUserId);
    const { projectId } = req.params;
    const result = await projectService.likeProject(userId, projectId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export { projectRouter };
