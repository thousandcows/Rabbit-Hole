import {
  Router, Request, Response, NextFunction,
} from 'express';
import { adminRequired } from '../../middlewares/admin-required';
import {
  userService, articleService, commentService, projectService,
} from '../../services';
import { transPort } from '../../utils/email';

const adminRouter = Router();

// 1. 유저 관리 기능
// 1-1. 전체 유저 조회 기능
adminRouter.get('/users', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { role, page, perPage } = req.query;
    const searchCondition = {
      role,
      page: Number(page),
      perPage: Number(perPage),
    };
    const [userList, totalPage] = await userService.getAllUsers(searchCondition);
    res.status(200).json({ userList, totalPage });
  } catch (error) {
    next(error);
  }
});
// 1-2. 유저 승인 기능
adminRouter.put('/users/:userId', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    console.log(userId, role);
    const updatedUser = await userService.authorizeUser(userId, role);
    // nodeMailer 옵션
    const mailOptions = {
      from: `rabbit-hole <${process.env.NODEMAILER_USER}>`,
      to: updatedUser.githubEmail,
      subject: '회원가입이 완료되었습니다',
      html: `<div
            style="
              display: flex;
              justify-content: center;
              width: 100%;
              margin-top: 20px;
            "
          >
            <img
              width="100%"
              style="border-radius: 40px;"
              src="https://elice.io/static/home-a888ef6be756e8004497603c45aa6fb3.png"
            />
          </div>
          <br />
          <div style="font-size: 24px; text-align: center; margin: 20px 0;">
            환영합니다:) 👏👏👏👏👏
          </div>
          <div style="font-size: 20px; text-align: center;">
            엘리스 레이서들을 위한 커뮤니티 Rabbit-Hole입니다!
          </div>
          <div style="font-size: 20px; text-align: center; margin: 20px 0;">
            ${updatedUser.name}님은 Guest에서 Racer로 인증이 완료되었습니다.
          </div>
          <div style="font-size: 20px; text-align: center;">
            열심히 활동해 주실거죠? 😘😘😘😘😘
          </div>`,
    };
    // 메일 전송
    await transPort.sendMail(mailOptions, (error) => {
      if (error) {
        const error = new Error('이메일 전송에 실패했습니다');
        error.name = 'NotFount';
        throw error;
      }
      res.status(200).json({
        status: 'Success',
        code: 200,
        message: 'Sent Auth Email',
      });
    });
  } catch (error) {
    next(error);
  }
});
// 1-3. 유저 삭제 기능
adminRouter.delete('/users/:userId', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const deleteResult = await userService.deleteUser(userId);
    res.status(200).json(deleteResult);
  } catch (error) {
    next(error);
  }
});
// 2. 게시글 관리 기능
// 2-1. 전체 게시글 조회
adminRouter.get('/articles', async (req: any, res: Response, next: NextFunction) => {
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
// 2-2. 게시글 삭제 기능
adminRouter.delete('/articles/:articleId', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { articleId } = req.params;
    const result = await articleService.deleteArticleForAdmin(articleId);
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
});
// 3. 댓글 관리 기능
// 3-1 전체 댓글 조회
adminRouter.get('/comments', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { commentType, page, perPage } = req.query;
    const searchCondition = {
      commentType: String(commentType),
      page: Number(page),
      perPage: Number(perPage),
    };
    const [commentList, totalPage] = await commentService.getAllComments(searchCondition);
    res.status(200).json({ commentList, totalPage });
  } catch (error) {
    next(error);
  }
});
// 3-2. 댓글 삭제 기능
adminRouter.delete('/comments/:commentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await commentService.deleteCommentForAdmin(commentId);
    res.status(200).json(deletedComment);
  } catch (error) {
    next(error);
  }
});
// 4. 프로젝트 관리 기능
// 4-1. 프로젝트 조회 기능
adminRouter.get('/projects', async (req: any, res: Response, next: NextFunction) => {
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
// 4-2. 프로젝트 삭제 기능
adminRouter.delete('/projects/:projectId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const result = await projectService.deleteProjectForAdmin(projectId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export { adminRouter };
