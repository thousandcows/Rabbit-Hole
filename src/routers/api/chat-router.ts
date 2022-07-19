import {
  Router, Request, Response, NextFunction,
} from 'express';
import { chatService } from '../../services';

const chatRouter = Router();

chatRouter.get('/', async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const perPage = Number(req.query.perPage);
    const [chatList, totalPage] = await chatService.getPaginatedChats(page, perPage);
    res.status(200).json({ chatList, totalPage });
  } catch (error) {
    next(error);
  }
});

export { chatRouter };
