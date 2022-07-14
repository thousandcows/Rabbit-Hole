import {
    Router, Request, Response, NextFunction,
  } from 'express';
  const upload = require('../../utils/multer-s3');
  
  const imageRouter = Router();
  
  // 이미지 업로드 url
  imageRouter.post('/', upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const img: any = req.file;
      // 이미지 업로드 확인
      if (img) {
        const imageUrl = img.location;
        res.status(201).json({ imageUrl });
      } else {
        const error = new Error('이미지 업로드에 실패하였습니다');
        error.name = '';
      }
    } catch (error) {
      next(error);
    }
  });
  
  
  export { imageRouter };
  