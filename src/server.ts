import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import webSocket from './socket';
import { apiRouter } from './routers/api';
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { uploadFile, downloadFile } = require('./s3');

const app = express();
app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

const { PORT } = process.env;

app.get('/', (req: any, res: any) => {
  // eslint-disable-next-line no-path-concat, prefer-template
  res.sendFile(__dirname + '/chatting-test.html');
});
// 기능 구현 완료 후 routing 작업 예정
// s3에 파일 이미지 업로드
app.post('/images', upload.single('image'), async (req: Request, res: Response) => {
  // 이미지 파일을 요청에서 받아옴
  const { file } = req;
  // 이미지 파일 mime 타입 확인
  const fileType = file?.mimetype.split('/')[0];
  if (fileType !== 'image') {
    const error = new Error('올바른 이미지 형식이 아닙니다');
      error.name = 'NotAcceptable';
      throw error;
  };
  // 이미지 크기 확인
  if (file && file.size >= 1024 * 1024) {
    const error = new Error('파일 크기는 10MB 이하여야 합니다');
    error.name = 'NotAcceptable';
    throw error;
  };
  // 이미지 크기 조정 (구현 예정)
  // 이미지 s3에 업로드
  const result = await uploadFile(file);
  await unlinkFile(file?.path);
  res.send({ imagePath: `/images/${result.Key}` });
});
// s3에서 파일 이미지 키 다운로드
app.get('/images/:key', async (req: Request, res: Response) => {
  const readStream = await downloadFile(req.params.key);
  readStream.pipe(res);
});

app.use('/api', apiRouter);

const server = app.listen(PORT, () => console.log(`server is running ${PORT}`));

// socket
webSocket(server);
