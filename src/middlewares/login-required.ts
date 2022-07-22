/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { userService } from '../services';

interface UserEmail{
  email: string;
  primary:true;
  verified: true;
  visibility: any;
}

async function loginRequired(req: any, res: Response, next: NextFunction) {
  // request 헤더로부터 authorization bearer 토큰을 받음.

  const wholeToken = req.headers.authorization?.split(' ');

  if (wholeToken) {
    // token format 확인
    const tokenFormat = wholeToken[0];
    if (tokenFormat !== 'Bearer') {
      res.status(401).json({
        result: 'Unauthorized',
        reason: '지원되지 않는 토큰 포맷입니다.',
      });
    }

    const userToken = wholeToken[1];
    // 이 토큰은 github 토큰 문자열이거나, 혹은 "null" 문자열이거나, undefined임.
    // 토큰이 "null" 일 경우, login_required 가 필요한 서비스 사용을 제한함.
    if (!userToken || userToken === 'null') {
      res.status(401).json({
        result: 'Unauthorized',
        reason: '로그인한 유저만 사용할 수 있는 서비스입니다.',
      });
    }

    try {
      const userEmail = await axios.get('https://api.github.com/user/emails', {
        headers: {
          Accept: 'application/json',
          Authorization: `token ${userToken}`,
        },
      });
      const user = await userService
        .getUserByEmail(userEmail.data.filter((obj: UserEmail) => obj.primary)[0].email);
      if (!user) {
        const error = Error('등록된 회원이 아닙니다.');
        error.name = 'Unauthorized';
        throw error;
      }
      req.currentUserId = String(user._id);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    res.status(401).json({
      result: 'Unauthorized',
      reason: '토큰이 존재하지 않습니다.',
    });
  }
}

export { loginRequired };
