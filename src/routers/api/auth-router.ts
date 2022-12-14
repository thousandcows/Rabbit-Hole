/* eslint-disable no-underscore-dangle */
import {
  NextFunction, Request, Response, Router,
} from 'express';
import axios from 'axios';
import { userService } from '../../services';

interface UserEmail{
  email: string;
  primary:true;
  verified: true;
  visibility: any;
}

const authRouter = Router();

// 깃허브 로그인 callback url
authRouter.get('/github/callback', async (req: any, res:Response, next:NextFunction) => {
  try {
    // 요청 코드
    const { code } = req.query;
    const accessTokenUrl = `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}`;

    // 깃허브 토큰 데이터
    const { data } = await axios.get(accessTokenUrl, {
      headers: {
        Accept: 'application/json',
      },
    });
    // 깃허브 access 토큰
    const accessToken = data.access_token;

    // 깃허브 유저 정보
    const user = await axios.get('https://api.github.com/user', {
      headers: {
        Accept: 'application/json',
        Authorization: `token ${accessToken}`,
      },
    });

    // 깃허브 유저 이메일 정보
    const userEmail = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Accept: 'application/json',
        Authorization: `token ${accessToken}`,
      },
    });
    // 필요한 정보 객체화
    const userInfo = {
      githubEmail: userEmail.data.filter((obj: UserEmail) => obj.primary)[0].email,
      githubProfileUrl: user.data.html_url,
      githubAvatar: user.data.avatar_url,
    };

    // 이미 가입된 회원인지 확인
    const userData = await userService.getUserByEmail(userInfo.githubEmail);
    if (userData) {
      // 로그인 토큰, userId, userName, 만료시간 600
      const loginFrontUrl = `${process.env.HOME_URL}/github/login?token=${accessToken}&userId=${userData._id}&userName=${userData.name}&carrots=${userData.carrots}&expire=86400&role=${userData.role}`;
      res.redirect(loginFrontUrl);
    } else {
      // 회원가입
      const registerFrontUrl = `${process.env.HOME_URL}/github/register?token=${accessToken}&githubProfileUrl=${userInfo.githubProfileUrl}&githubEmail=${userInfo.githubEmail}&githubAvatar=${userInfo.githubAvatar}`;
      res.redirect(registerFrontUrl);
    }
  } catch (error) {
    next(error);
  }
});

// 깃허브 로그인 url
authRouter.get('/github/login', async (req: any, res: Response, next: NextFunction) => {
  try {
    const accessTokenUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=user`;
    res.redirect(accessTokenUrl);
  } catch (error) {
    next(error);
  }
});

export { authRouter };
