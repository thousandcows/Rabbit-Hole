import { Types } from 'mongoose';

/* eslint-disable no-unused-vars */
export {};

declare global {
  namespace Express {
    interface Request {
      currentUserId?: Types.ObjectId;
    }
  }
}
