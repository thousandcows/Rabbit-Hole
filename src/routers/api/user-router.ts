import {
  Router, Request, Response, NextFunction,
} from 'express';
import { loginRequired } from '../../middlewares/login-required';
import { userService } from '../../services';
import { contentTypeChecker } from '../../utils/content-type-checker';

const userRouter = Router();

userRouter.get('/mypage', loginRequired, async (req:Request, res:Response, next:NextFunction) => {
  try {
    const githubEmail = req.currentGithubEmail;
    if (!githubEmail) {
      const error = new Error('로그인 후 확인 가능합니다.');
      error.name = 'Unauthorized';
      throw error;
    }
    const myInfo = await userService.getUserByEmail(githubEmail);
    res.status(200).json(myInfo);
  } catch (error) {
    next(error);
  }
});

userRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInfo = req.body;
    contentTypeChecker(userInfo);
    // 위 데이터를 사용자 db에 추가하기
    const newUser = await userService.addUser(userInfo);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

userRouter.get('/list', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 전체 사용자 목록을 얻음
    const users = await userService.getUsers();

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

userRouter.get('/:githubEmail', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { githubEmail } = req.params;

    const userData = await userService.getUserByEmail(githubEmail);

    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
});

userRouter.put('/', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const githubEmail = req.currentGithubEmail;
    const githubEmail = 'chss3339@gmail.com';
    if (!githubEmail) {
      const error = new Error('로그인 후 개인정보 변경이 가능합니다.');
      error.name = 'Unauthorized';
      throw error;
    }
    const update = req.body;
    contentTypeChecker(update);
    // 사용자 정보를 업데이트함.
    const updatedUser = await userService.setUser(githubEmail, update);

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.delete('/', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const githubEmail = req.currentGithubEmail;
    if (!githubEmail) {
      const error = new Error('로그인 후 확인 가능합니다.');
      error.name = 'Unauthorized';
      throw error;
    }
    const deleteResult = await userService.deleteUser(githubEmail);

    res.status(200).json(deleteResult);
  } catch (error) {
    next(error);
  }
});

export { userRouter };
