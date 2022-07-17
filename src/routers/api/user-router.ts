import {
  Router, Request, Response, NextFunction,
} from 'express';
import { loginRequired } from '../../middlewares';
import { userService, articleService, projectService } from '../../services';
import { validation } from '../../utils/validation';
import { upload } from '../../utils/multer-s3';

const userRouter = Router();

// 마이페이지
userRouter.get('/mypage', loginRequired, async (req:Request, res:Response, next:NextFunction) => {
  try {
    const userId = validation.isLogin(req.currentUserId);
    const myInfo = await userService.getUserById(userId);
    res.status(200).json(myInfo);
  } catch (error) {
    next(error);
  }
});

// 마이페이지 - 게시글 조회
userRouter.get('/:userId/articles', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { page, perPage } = req.query;
    const searchCondition = { userId, page: Number(page), perPage: Number(perPage) };
    const [articleList, totalPage] = await articleService.findProjectById(searchCondition);
    res.status(200).json({ articleList, totalPage });
  } catch (error) {
    next(error);
  }
});

// 마이페이지 - 프로젝트 조회
userRouter.get('/:userId/projects', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { page, perPage } = req.query;
    const searchCondition = { userId, page: Number(page), perPage: Number(perPage) };
    const [projectList, totalPage] = await projectService.findProjectById(searchCondition);
    res.status(200).json({ projectList, totalPage });
  } catch (error) {
    next(error);
  }
});

// 회원가입
userRouter.post('/register', upload.single('authImage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const img: any = req.file;
    console.log(req.file);
    // 회원 이미지 업로드 확인
    if (img) {
      const authImage = img.location;
      const {
        name, track, trackCardinalNumber, position, githubEmail, githubProfileUrl, githubAvatar,
      } = req.body;
      const userInfo = {
        name,
        track,
        trackCardinalNumber,
        position,
        authImage,
        githubEmail,
        githubProfileUrl,
        githubAvatar,
      };
      const newUser = await userService.addUser(userInfo);
      res.status(201).json(newUser);
    } else {
      const error = new Error('이미지 업로드에 실패하였습니다');
      error.name = 'NotFound';
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// 이메일로 회원 조회
userRouter.get('/:githubEmail', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { githubEmail } = req.params;

    const userData = await userService.getUserByEmail(githubEmail);

    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
});

// 회원정보 수정
userRouter.put('/', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = validation.isLogin(req.currentUserId);
    const update = req.body;
    // 사용자 정보를 업데이트함.
    const updatedUser = await userService.setUser(userId, update);

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// 회원탈퇴
userRouter.delete('/', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = validation.isLogin(req.currentUserId);
    const deleteResult = await userService.deleteUser(userId);

    res.status(200).json(deleteResult);
  } catch (error) {
    next(error);
  }
});

export { userRouter };
