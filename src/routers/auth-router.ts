import { NextFunction, Request, Response, Router } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { userService } from '../services';

const authRouter = Router();

authRouter.get('/github', async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.query;
  try {
    const { data } = await axios.get(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    console.log("데이터 ", data);
    const user = await axios.get('https://api.github.com/user', {
      headers: {
        Accept: 'application/json',
        Authorization: `token ${data.access_token}`,
      },
    });
    console.log(user.data);
    res.json({success: true});
  } catch (error) {
    next(error);
  }
});

export { authRouter };
