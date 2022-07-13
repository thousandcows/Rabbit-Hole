import { Router, Request, Response, NextFunction } from 'express';
import { userService, articleService, commentService } from '../../services';

const adminRouter = Router();

// 1. 유저 관리 기능
// 1-1. 전체 유저 조회 기능
adminRouter.get('/users', (req: Request, res: Response, next: NextFunction) => {
    const { page, perPage } = req.query;

});
// 1-2. 유저 삭제 기능
adminRouter.delete('/users', (req: Request, res: Response, next: NextFunction) => {

});
// 2. 게시글 관리 기능
// 2-1. 전체 게시글 조회
adminRouter.get('/articles', (req: Request, res: Response, next: NextFunction) => {

});
// 2-2. 게시글 삭제 기능
adminRouter.delete('/articles', (req: Request, res: Response, next: NextFunction) => {

});
// 3. 댓글 관리 기능
// 3-1 전체 댓글 조회
adminRouter.get('/comments', (req: Request, res: Response, next: NextFunction) => {

});
// 3-2. 댓글 삭제 기능
adminRouter.delete('/comments', (req: Request, res: Response, next: NextFunction) => {

});
// 4. 프로젝트 관리 기능
// 4-1. 프로젝트 조회 기능
adminRouter.get('/projects', (req: Request, res: Response, next: NextFunction) => {

});
// 4-2. 프로젝트 삭제 기능
adminRouter.delete('/projects', (req: Request, res: Response, next: NextFunction) => {

});
export { adminRouter };