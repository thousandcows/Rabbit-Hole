import {
  NextFunction, Request, Response, Router,
} from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { userService } from '../services';

const authRouter = Router();

authRouter.get('/github', async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.query;
  try {
    // data = {access_token: '토큰문자열', token_type: 'bearer', scope: 'read:repo_hook,repo:status,user:email'}
    const { data } = await axios.get(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    const user = await axios.get('https://api.github.com/user', {
      headers: {
        Accept: 'application/json',
        Authorization: `token ${data.access_token}`,
      },
    });
    const userEmail = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Accept: 'application/json',
        Authorization: `token ${data.access_token}`,
      },
    });
    const userInfo = {
      githubEmail: userEmail.data[0].email,
      githubProfileUrl: user.data.html_url,
      githubAvatar: user.data.avatar_url,
    };
    res.status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
});

export { authRouter };
