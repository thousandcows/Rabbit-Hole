import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/user-service';

async function adminRequired(req: any, res: Response, next: NextFunction) {
  const adminId = req.currentUserId;
  if (adminId) {
    const adminInfo = await userService.getUserById(adminId);
    if (adminInfo.role === 'admin') {
      next();
    } else {
      const error = new Error('관리자 권한이 없습니다.');
      error.name = 'Forbidden';
      throw error;
    }
  }
}

export { adminRequired };
