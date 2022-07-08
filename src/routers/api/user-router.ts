import {
  Router, Request, Response, NextFunction,
} from 'express';
import { userService } from '../../services';

const userRouter = Router();

userRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInfo = req.body;
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

// userRouter.get('/id', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const _id = req.currentUserId;
//     const userData = await userService.getUserById(_id);

//     res.status(200).json(userData);
//   } catch (error) {
//     next(error);
//   }
// });

// userRouter.get('/email', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const githubEmail = req.currentUserEmail;
//     const userData = await userService.getUserByEmail(githubEmail);

//     res.status(200).json(userData);
//   } catch (error) {
//     next(error);
//   }
// });

// userRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {

//   try {
//     const githubEmail = req.currentUserEmail;
//     const update = req.body;

//     // 사용자 정보를 업데이트함.
//     const updatedUser = await userService.setUser(githubEmail, update);

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     next(error);
//   }
// });

// userRouter.delete('/', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const githubEmail = req.currentUserEmail;
//     const deleteResult = await userService.deleteUser(githubEmail);

//     res.status(200).json(deleteResult);
//   } catch (error) {
//     next(error);
//   }
// });

export { userRouter };
