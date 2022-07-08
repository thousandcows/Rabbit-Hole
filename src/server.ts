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
  res.sendFile(__dirname + '/index.html');
});

app.post('/images', upload.single('image'), async (req: Request, res: Response) => {
  const { file } = req;
  const result = await uploadFile(file);
  await unlinkFile(file?.path);
  res.send({ imagePath: `/images/${result.Key}` });
});

app.get('/images/:key', async (req: Request, res: Response) => {
  const readStream = await downloadFile(req.params.key);
  readStream.pipe(res);
});

app.use('/api', apiRouter);

const server = app.listen(PORT, () => console.log(`server is running ${PORT}`));

// socket
webSocket(server);
