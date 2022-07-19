import { Request } from 'express';

require('dotenv').config();

const S3 = require('aws-sdk/clients/s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

// s3 객체 생성
const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const storage = multerS3({
  s3,
  bucket: bucketName,
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/gif' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    const error = new Error('지원하는 이미지 타입이 아닙니다');
    error.name = 'Forbidden';
    throw error;
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter,
});

export { upload };
