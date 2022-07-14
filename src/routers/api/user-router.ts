import {
  Router, Request, Response, NextFunction,
} from 'express';
import { loginRequired } from '../../middlewares';
import { userService } from '../../services';
import { contentTypeChecker } from '../../utils/content-type-checker';
import { validation } from '../../utils/validation';

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

// 회원가입
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

// 회원 인증 이미지 등록
userRouter.post('/image', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageInfo = req.body;
    // 이미지 데이터를 S3에 업로드
    const imageUrl = await userService.addAuthImage(imageInfo);
    // 이미지 url을 반환
    res.status(201).json(imageUrl);
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
    contentTypeChecker(update);
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
