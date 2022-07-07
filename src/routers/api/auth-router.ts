import { Router } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { userService } from '../../services/';

const authRouter = Router();

const findOrCreateUser = async (profile: any) => {
  const user = await userService.getUser(profile.id, true);

  if (user) {
    return user;
  }
  const withdrawal = await userService.getWithdrawal(profile.id);
  if (withdrawal) {
    throw new Error('탈퇴한 회원입니다.');
  }
  const created = await userService.addAuthUser(profile);

  return created;
};

authRouter.get('/:code', async (req, res, next) => {
  const { code } = req.params;
  try {
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
    const userInfo = {
      id: user.data.id,
      displayName: user.data.name,
      username: user.data.login,
      profileUrl: user.data.html_url,
      avatar: user.data.avatar_url,
      blog: user.data.blog,
    };
    const createdUser = await findOrCreateUser(userInfo);
    const token = jwt.sign(
      { id: createdUser._id, name: createdUser.username },
      process.env.JWT_SECRET_KEY,

      {
        expiresIn: process.env.ACCESSTOKEN_EXPIRE,
      },
    );
    res.status(200).json({ token, username: createdUser.username, userId: createdUser._id });
  } catch (error) {
    next(error);
  }
});

export default authRouter;
